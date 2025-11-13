https://gitlab-com.gitlab.io/support/toolbox/upgrade-path

# Upgrade Path

Generate supported upgrade paths to assist with updating GitLab.

## API / Upgrade Data Points

There isn't an specific API, but there is an json artifact that can be downloaded.

```
https://gitlab-com.gitlab.io/support/toolbox/upgrade-path/path.json
```

```json
{"supported":["17.3.6","17.5.1"], "all":["16.7.10","16.11.10","17.3.6","17.5.1","17.5.1"]}
```

# Adding a new supported path

Upgrade path is generated from https://gitlab.com/gitlab-org/gitlab/-/raw/master/config/upgrade_path.yml.

## Update Upgrade Path

Follow the instruction from [adding a required stop](https://docs.gitlab.com/ee/development/avoiding_required_stops.html#adding-required-stops).

## Alerts

Alerts are things that potentially span different versions where actions may need to be taken.


<details open> 

<summary> View Alert Schema </summary>

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `start` | string | The minimum GitLab version (inclusive) where this alert applies |
| `end` | string | The maximum GitLab version (inclusive) where this alert applies |
| `severity` | string | Alert level: `warning` or `error` |
| `title` | string | Brief, descriptive title for the alert |
| `requires_version` | string or null | Specific version required before proceeding (e.g., "15.1"), or `null` if not applicable |
| `check_when` | string | When to display the alert: `preupgrade`, `upgrade`, or `postupgrade` |
| `message` | string | Detailed message with upgrade instructions. Supports markdown formatting |

### Field Details

#### `start` and `end`
- **Format**: Semantic version string (e.g., "15.0.0", "16.11.0")
- **Purpose**: Defines the version range where this alert is relevant & potentially impacting
- **Example**: An alert with `start: "16.0.0"` and `end: "16.4.0"` applies to versions 16.0.0 through 16.4.0

#### `severity`
- **Values**: 
  - `warning` - Important information that requires attention but may not block upgrade
  - `error` - Critical issues that must be addressed, may indicate breaking changes
- **Usage**: Determines visual presentation and urgency level

#### `title`
- **Format**: Plain text string
- **Purpose**: Concise summary displayed prominently to users
- **Best Practice**: Should be descriptive enough to understand the alert's purpose at a glance

#### `requires_version`
- **Format**: Version string (e.g., "16.1") or `null`
- **Purpose**: Specifies an intermediate version users must upgrade to before proceeding to their target version
- **Example**: `requires_version: "16.1"` means users must upgrade to 16.1 first
- **Use `null`**: When the alert provides general information without requiring a specific intermediate version

#### `check_when`
- **Values**:
  - `preupgrade` - Review before the upgrade process begins
  - `upgrade` - Review during the upgrade process
  - `postupgrade` - Review after the upgrade completes
- **Purpose**: Used by downstream tools to determine when an alert should be raised/reraised.

#### `message`
- **Format**: Markdown-formatted string (supports multi-line using `>` YAML syntax)
- **Purpose**: Provides detailed context, instructions, and links to documentation
- **Best Practices**:
  - Include relevant documentation links
  - Use markdown for emphasis (`**bold**`) and links (`[text](url)`)
  - Be specific about actions required
  - Reference GitLab version numbers clearly (major.minor or major.minor.patch)

### Complete Example
```yaml
---
- start: "16.0.0"
  end: "16.4.0"
  severity: warning
  title: "Instances with NPM packages in their package registry"
  requires_version: "16.1"
  check_when: preupgrade
  message: >
    If you have [npm packages](https://docs.gitlab.com/ee/update/versions/gitlab_16_changes.html#1610) 
    in your package registry, you must upgrade to **16.1** first.
```
</details>

### Adding new alerts

To add/edit alerts:

1. Edit the `alerts.yml`
2. Add a new entry

Alerts should be in order of start version, then requires version e.g.

```yaml
  # trimmed example:
  start: "16.0.0"
  end: "16.4.0"
  requires_version: "16.1"

  start: "16.0.0"
  end: "16.3.0"
  requires_version: "16.2"
```

## Background Migrations

The tool now displays background database migrations that will run during upgrades, helping users understand:
- Which migrations will execute between versions
- Warnings for migrations affecting large tables
- Migration details including affected schemas and tables

### Data Generation
Background migration data is automatically collected from the GitLab repository:
```shell
bundle exec collect_background_migrations.rb
```
This generates `ruby/background_migrations.js` with migration metadata.

## Merge Request

1. Open a new merge request cc/assign @davinwalker

## Testing

1. With [asdf](https://asdf-vm.com/) installed, run `scripts/bootstrap.sh`.
1. Run `make` to build.
1. Run a local Web server:

    ```shell
    ruby -run -e httpd build -p 8000
    ```

1. Visit [http://localhost:8000](http://localhost:8000).


