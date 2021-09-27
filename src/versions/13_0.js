import flux from "@aust/react-flux";

const notes = `
*  Puma becoming default web server instead of Unicorn. [Convert Unicorn to Puma](https://docs.gitlab.com/ee/administration/operations/puma.html#convert-unicorn-settings-to-puma)

Starting with GitLab 13.0, Puma will be the default web server used in
\`omnibus-gitlab\` based installations. This will be the case for both fresh
installations as well as upgrades, unless users have explicitly disabled Puma
and enabled Unicorn. Users who have Unicorn configuration are recommended to
refer to .

### PostgreSQL 11 becoming minimum required version

To upgrade to GitLab 13.0 or later, users must be already running PostgreSQL 11.
PostgreSQL 9.6 and 10 [have been removed from](https://gitlab.com/gitlab-org/omnibus-gitlab/-/merge_requests/4186)
the package. Follow [the documentation](../settings/database.md#upgrade-packaged-postgresql-server)
on how to upgrade the packaged PostgreSQL server to required version.

### Alertmanager moved from the \`gitlab\` namespace to \`monitoring\`

In \`/etc/gitlab/gitlab.rb\`, change:

\`\`\`ruby
alertmanager['flags'] = {
  'cluster.advertise-address' => "127.0.0.1:9093",
  'web.listen-address' => "#{node['gitlab']['alertmanager']['listen_address']}",
  'storage.path' => "#{node['gitlab']['alertmanager']['home']}/data",
  'config.file' => "#{node['gitlab']['alertmanager']['home']}/alertmanager.yml"
}
\`\`\`

to:

\`\`\`ruby
alertmanager['flags'] = {
  'cluster.advertise-address' => "127.0.0.1:9093",
  'web.listen-address' => "#{node['monitoring']['alertmanager']['listen_address']}",
  'storage.path' => "#{node['monitoring']['alertmanager']['home']}/data",
  'config.file' => "#{node['monitoring']['alertmanager']['home']}/alertmanager.yml"
}
\`\`\`
`;

flux.dispatch("version/add", {
  major: 13,
  minor: 0,
  blog: "https://about.gitlab.com/releases/2020/05/22/gitlab-13-0-released/",
  notes: notes,
});
