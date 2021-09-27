versions = ['12.0.12', '12.1.17', '12.10.14', '13.0.14', '13.1.11', '13.8.8', '13.12.12', '14.0.11']

versions.each do |v|
  version = SemVersion.new v
  output = <<~BLOCK
    import flux from "@aust/react-flux";

    flux.dispatch("version/add", {
      major: #{version.major},
      minor: #{version.minor},
    });
  BLOCK

  File.write("#{version.major}_#{version.minor}.js", output)
end
