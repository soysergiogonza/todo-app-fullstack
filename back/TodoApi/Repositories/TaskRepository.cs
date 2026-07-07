using Npgsql;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class TaskRepository
{
    private readonly string _connectionString;

    public TaskRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<List<TaskItem>> GetAllAsync()
    {
        var tasks = new List<TaskItem>();
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        const string sql = """
            SELECT id, title, completed, created_at
            FROM tasks
            ORDER BY id
            """;

        await using var command = new NpgsqlCommand(sql, connection);
        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            tasks.Add(new TaskItem
            {
                Id = reader.GetInt32(0),
                Title = reader.GetString(1),
                Completed = reader.GetBoolean(2),
                CreatedAt = reader.GetDateTime(3)
            });
        }

        return tasks;
    }

    public async Task<TaskItem> CreateAsync(string title)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        const string sql = """
            INSERT INTO tasks(title)
            VALUES (@title)
            RETURNING id, title, completed, created_at
            """;

        using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("title", title);

        using var reader = await command.ExecuteReaderAsync();
        await reader.ReadAsync();

        return new TaskItem
        {
            Id = reader.GetInt32(0),
            Title = reader.GetString(1),
            Completed = reader.GetBoolean(2),
            CreatedAt = reader.GetDateTime(3)
        };
    }

    public async Task<TaskItem?> UpdateAsync(int id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        const string sql = """
            UPDATE tasks
            SET completed = NOT completed
            WHERE id = @id
            RETURNING id, title, completed, created_at
            """;

        using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("id", id);

        using var reader = await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync()) return null;

        return new TaskItem
        {
            Id = reader.GetInt32(0),
            Title = reader.GetString(1),
            Completed = reader.GetBoolean(2),
            CreatedAt = reader.GetDateTime(3)
        };
    }
}