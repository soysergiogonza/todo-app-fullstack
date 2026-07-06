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

        const string sql = "SELECT id, title, completed, created_at FROM tasks ORDER BY id";

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
}