#!/usr/bin/env ruby
# frozen_string_literal: true

require 'labclient'

# Large tables that should trigger warnings (based on GitLab.com data)
LARGE_TABLES = {
  'main' => %w[
    users projects issues merge_requests notes events
    push_event_payloads merge_request_diff_files system_note_metadata
    project_authorizations members namespaces routes
  ],
    'ci' => %w[
    ci_builds ci_job_artifacts ci_pipeline_variables
    ci_job_variables ci_build_tags ci_stages
  ],
    'sec' => %w[
    vulnerability_occurrences vulnerability_occurrence_identifiers
    security_findings vulnerability_feedback vulnerabilities
  ]
}.freeze

def collect_background_migrations
  client = LabClient::Client.new(url: 'https://gitlab.com', token: '')
  project = 'gitlab-org/gitlab'

  puts "🔍 Collecting background migrations from GitLab repository..."
  puts "📁 Fetching post-migration files..."

  begin
    repo_tree = client.repository.tree(project, ref: :master, path: 'db/post_migrate')
    migrations = repo_tree.select { |item| item.name.end_with?('.rb') }
  rescue => e
    puts "❌ Error fetching repository tree: #{e.message}"
    return
  end

  puts "📄 Found #{migrations.size} migration files"

  migration_data = []
  processed = 0

  migrations.each do |file|
    processed += 1
    print "\r🔄 Processing file #{processed}/#{migrations.size}: #{file.name}"

    begin
      content = client.files.show(project, file.path, :master, :raw).data
      migration_info = parse_migration_file(content, file.name)
      migration_data << migration_info if migration_info
    rescue => e
      puts "\n❌ Error processing #{file.name}: #{e.message}"
    end
  end

  puts "\n✅ Processed #{processed} migration files"
  puts "🎯 Found #{migration_data.size} background migrations"

  # Group by milestone/version
  grouped_migrations = migration_data.group_by { |m| m[:milestone] }

  # Sort by milestone
  sorted_migrations = grouped_migrations.sort_by { |milestone, _| 
    # Handle version sorting properly
    version_parts = milestone.split('.').map(&:to_i)
    version_parts[0] * 1000 + version_parts[1] * 10 + (version_parts[2] || 0)
  }.to_h

  # src/util/background_migrations.js
  File.write(
    'background_migrations.js',
    "const backgroundMigrations = #{sorted_migrations.to_json};\nexport default backgroundMigrations;"
  )

  puts "\n📊 Summary:"
  puts "   Total migrations: #{migration_data.size}"
  puts "   Across milestones: #{grouped_migrations.size}"
  puts "   With warnings: #{migration_data.count { |m| m[:has_large_table] }}"

  puts "\n📁 Generated files:"
  puts "   - background_migrations.js"

  puts "\n🔍 Sample migrations by milestone:"
  sorted_migrations.each do |milestone, migrations|
    warning_count = migrations.count { |m| m[:has_large_table] }
    puts "   #{milestone}: #{migrations.size} migrations#{warning_count > 0 ? " (#{warning_count} with warnings)" : ""}"
  end
end

def parse_migration_file(content, filename)
  milestone_match = content.match(/milestone\s+['"]([^'"]+)['"]/m)
  return nil unless milestone_match

  schema = extract_schema(content)

  tables = extract_tables_from_content(content)
  return nil if tables.empty?

  migration_class = extract_migration_class(content)

  warnings = determine_warnings(tables, schema)

  {
    filename: filename,
    milestone: milestone_match[1],
    schema: schema,
    tables: tables,
    migration_class: migration_class,
    warnings: warnings,
    has_large_table: !warnings.empty?
  }
end

def extract_schema(content)
  schema_match = content.match(/restrict_gitlab_migration\s+gitlab_schema:\s*:(\w+)/m)
  return schema_match[1] if schema_match

  # Default to 'main' if no schema specified
  'main'
end

def extract_tables_from_content(content)
  tables = []

  # Look for queue_batched_background_migration calls with symbol format
  content.scan(/queue_batched_background_migration\s*\(\s*[^,]+,\s*:(\w+)/m) do |match|
    tables << match[0]
  end

  # Also look for string format
  content.scan(/queue_batched_background_migration\s*\(\s*[^,]+,\s*['"](\w+)['"]/m) do |match|
    tables << match[0]
  end

  # Handle table constants (some migrations define TABLE_NAME constants)
  table_constants = {}
  content.scan(/(\w+_TABLE)\s*=\s*['"](\w+)['"]/m) do |const_name, table_name|
    table_constants[const_name] = table_name
  end

  content.scan(/queue_batched_background_migration\s*\(\s*[^,]+,\s*(\w+_TABLE)/m) do |match|
    tables << table_constants[match[0]] if table_constants[match[0]]
  end

  tables.uniq
end

def extract_migration_class(content)
  # Extract the MIGRATION constant - handles newlines
  migration_match = content.match(/MIGRATION\s*=\s*['"]([^'"]+)['"]/m)
  return migration_match[1] if migration_match

  # Fallback to direct string in queue_batched_background_migration
  direct_match = content.match(/queue_batched_background_migration\s*\(\s*['"]([^'"]+)['"]/m)
  return direct_match[1] if direct_match

  # Fallback to class name
  class_match = content.match(/class\s+(\w+)\s*</m)
  class_match ? class_match[1] : 'Unknown'
end

def determine_warnings(tables, schema = nil)
  warnings = []

  tables.each do |table|
    # Check in the specific schema first
    if schema && LARGE_TABLES[schema]&.include?(table)
      warnings << {
        table: table,
        database: schema,
        message: "Large table in #{schema} schema - migration may take significant time"
      }
      next
    end

    # Then check all schemas
    LARGE_TABLES.each do |db, large_tables|
      if large_tables.include?(table)
        warnings << {
          table: table,
          database: db,
          message: 'Large table - migration may take significant time'
        }
        break
      end
    end
  end

  warnings
end

# Run the collection
if __FILE__ == $0
  puts "🚀 GitLab Background Migration Collector"
  puts "=" * 50
  collect_background_migrations
  puts "\n✨ Done!"
end
