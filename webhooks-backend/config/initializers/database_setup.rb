# Database setup initializer
# Ensures storage directory exists for SQLite databases

Rails.application.config.after_initialize do
  # Ensure storage directory exists
  storage_path = Rails.root.join('storage')
  FileUtils.mkdir_p(storage_path) unless File.directory?(storage_path)

  # Set proper permissions for SQLite database files
  if Rails.env.production?
    Dir.glob(storage_path.join('*.sqlite3')).each do |db_file|
      File.chmod(0644, db_file) if File.exist?(db_file)
    end
  end
end
