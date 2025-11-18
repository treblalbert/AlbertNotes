namespace NotesWidget;

public class NotesManager
{
    public string? SelectedFolder { get; private set; }
    
    public void SetFolder(string folderPath)
    {
        if (Directory.Exists(folderPath))
        {
            SelectedFolder = folderPath;
        }
    }
    
    public List<string> GetNoteFiles()
    {
        if (string.IsNullOrEmpty(SelectedFolder) || !Directory.Exists(SelectedFolder))
            return new List<string>();
        
        return Directory.GetFiles(SelectedFolder, "*.txt")
                       .OrderBy(f => f)
                       .ToList();
    }
    
    public string GetNoteName(string filePath)
    {
        return Path.GetFileNameWithoutExtension(filePath);
    }
    
    public string ReadNoteContent(string filePath)
    {
        try
        {
            return File.ReadAllText(filePath);
        }
        catch
        {
            return string.Empty;
        }
    }
    
    public void SaveNoteContent(string filePath, string content)
    {
        try
        {
            File.WriteAllText(filePath, content);
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Error saving note: {ex.Message}", "Save Error", 
                          MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
    
    public string CreateNewNote()
    {
        if (string.IsNullOrEmpty(SelectedFolder))
            return string.Empty;
            
        var newNotePath = Path.Combine(SelectedFolder, $"New Note {DateTime.Now:yyyyMMddHHmmss}.txt");
        File.WriteAllText(newNotePath, string.Empty);
        return newNotePath;
    }
}