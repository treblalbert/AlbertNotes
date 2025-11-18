namespace NotesWidget;

public partial class NoteEditorForm : Form
{
    private string currentFilePath;
    private NotesManager notesManager;
    private TextBox contentTextBox;
    private System.Windows.Forms.Timer autoSaveTimer;
    private bool hasUnsavedChanges = false;
    
    public NoteEditorForm(string filePath, NotesManager manager)
    {
        currentFilePath = filePath;
        notesManager = manager;
        InitializeComponent();
        LoadNoteContent();
        SetupAutoSave();
    }
    
    private void InitializeComponent()
    {
        this.SuspendLayout();
        
        // Form properties
        this.Text = $"Note Editor - {Path.GetFileNameWithoutExtension(currentFilePath)}";
        this.Size = new Size(600, 500);
        this.StartPosition = FormStartPosition.CenterScreen;
        this.FormBorderStyle = FormBorderStyle.FixedSingle;
        this.MaximizeBox = true;
        
        // Content TextBox
        contentTextBox = new TextBox();
        contentTextBox.Multiline = true;
        contentTextBox.ScrollBars = ScrollBars.Vertical;
        contentTextBox.Dock = DockStyle.Fill;
        contentTextBox.Font = new Font("Segoe UI", 11);
        contentTextBox.TextChanged += ContentTextBox_TextChanged;
        this.Controls.Add(contentTextBox);
        
        this.ResumeLayout(false);
    }
    
    private void LoadNoteContent()
    {
        var content = notesManager.ReadNoteContent(currentFilePath);
        contentTextBox.Text = content;
        hasUnsavedChanges = false;
        UpdateTitle();
    }
    
    private void SetupAutoSave()
    {
        autoSaveTimer = new System.Windows.Forms.Timer();
        autoSaveTimer.Interval = 2000; // 2 seconds
        autoSaveTimer.Tick += (s, e) => {
            if (hasUnsavedChanges)
            {
                SaveNote();
            }
        };
        autoSaveTimer.Start();
    }
    
    private void ContentTextBox_TextChanged(object? sender, EventArgs e)
    {
        if (!hasUnsavedChanges)
        {
            hasUnsavedChanges = true;
            UpdateTitle();
        }
    }
    
    private void UpdateTitle()
    {
        var baseTitle = $"Note Editor - {Path.GetFileNameWithoutExtension(currentFilePath)}";
        this.Text = hasUnsavedChanges ? $"{baseTitle} *" : baseTitle;
    }
    
    private void SaveNote()
    {
        notesManager.SaveNoteContent(currentFilePath, contentTextBox.Text);
        hasUnsavedChanges = false;
        UpdateTitle();
    }
    
    protected override void OnDeactivate(EventArgs e)
    {
        base.OnDeactivate(e);
        
        // Auto-save when clicking away from the form
        if (hasUnsavedChanges)
        {
            SaveNote();
        }
    }
    
    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        // Final save on close
        if (hasUnsavedChanges)
        {
            SaveNote();
        }
        
        autoSaveTimer?.Stop();
        autoSaveTimer?.Dispose();
        base.OnFormClosing(e);
    }
}