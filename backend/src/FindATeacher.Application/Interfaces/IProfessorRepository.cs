using FindATeacher.Domain.Entities;

namespace FindATeacher.Application.Interfaces;

public interface IProfessorRepository
{
    IReadOnlyList<Professor> ObterTodos();
}