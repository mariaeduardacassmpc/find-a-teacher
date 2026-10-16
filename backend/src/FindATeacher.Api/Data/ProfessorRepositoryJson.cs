using System.Text.Json;
using FindATeacher.Application.Interfaces;
using FindATeacher.Domain.Entities;

namespace FindATeacher.Api.Data;

public class ProfessorRepositoryJson : IProfessorRepository
{
    private readonly List<Professor> _professores;

    public ProfessorRepositoryJson(IWebHostEnvironment environment)
    {
        var caminhoArquivo = Path.Combine(
            environment.ContentRootPath,
            "Data",
            "professores.json"
        );

        var json = File.ReadAllText(caminhoArquivo);

        var dados = JsonSerializer.Deserialize<ProfessoresJson>(json,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }
        );

        _professores = dados?.Professores ?? [];
    }

    public IReadOnlyList<Professor> ObterTodos() => _professores;
}