namespace NotesWidget;

public partial class MainWidgetForm : Form
{
    private NotesManager notesManager;
    private FileSystemWatcher? fileWatcher;
    private ListBox notesListBox;
    private Button selectFolderButton;
    private Button newNoteButton;
    private Dictionary<string, string> filePathMap; // Maps display names to full paths
    
    public MainWidgetForm()
    {
        InitializeComponent();
        notesManager = new NotesManager();
        filePathMap = new Dictionary<string, string>();
        SetupWidget();
    }
    
    private void InitializeComponent()
    {
        this.SuspendLayout();
        
        // Form properties
        this.Text = "Notes Widget";
        this.Size = new Size(250, 400);
        this.StartPosition = FormStartPosition.Manual;
        this.Location = new Point(Screen.PrimaryScreen.WorkingArea.Right - 260, 
                                Screen.PrimaryScreen.WorkingArea.Bottom - 420);
        this.FormBorderStyle = FormBorderStyle.SizableToolWindow;
        this.TopMost = true;
        this.ShowInTaskbar = false;
        
        // Select Folder Button
        selectFolderButton = new Button();
        selectFolderButton.Text = "Select Notes Folder";
        selectFolderButton.Size = new Size(220, 30);
        selectFolderButton.Location = new Point(10, 10);
        selectFolderButton.Click += SelectFolderButton_Click;
        this.Controls.Add(selectFolderButton);
        
        // New Note Button
        newNoteButton = new Button();
        newNoteButton.Text = "New Note";
        newNoteButton.Size = new Size(220, 30);
        newNoteButton.Location = new Point(10, 50);
        newNoteButton.Click += NewNoteButton_Click;
        this.Controls.Add(newNoteButton);
        
        // Notes ListBox
        notesListBox = new ListBox();
        notesListBox.Size = new Size(220, 250);
        notesListBox.Location = new Point(10, 90);
        notesListBox.DoubleClick += NotesListBox_DoubleClick;
        this.Controls.Add(notesListBox);
        
        this.ResumeLayout(false);
    }
    
    private void SetupWidget()
    {
        // Set up file system watcher when folder is selected
        // This will be called after folder selection
    }
    
    private void SelectFolderButton_Click(object? sender, EventArgs e)
    {
        using (var folderDialog = new FolderBrowserDialog())
        {
            folderDialog.Description = "Select folder containing your text notes";
            
            if (folderDialog.ShowDialog() == DialogResult.OK)
            {
                notesManager.SetFolder(folderDialog.SelectedPath);
                SetupFileWatcher(folderDialog.SelectedPath);
                RefreshNotesList();
            }
        }
    }
    
    private void NewNoteButton_Click(object? sender, EventArgs e)
    {
        if (string.IsNullOrEmpty(notesManager.SelectedFolder))
        {
            MessageBox.Show("Please select a folder first.", "No Folder Selected", 
                          MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }
        
        var newNotePath = notesManager.CreateNewNote();
        if (!string.IsNullOrEmpty(newNotePath))
        {
            RefreshNotesList();
            OpenNoteEditor(newNotePath);
        }
    }
    
    private void NotesListBox_DoubleClick(object? sender, EventArgs e)
    {
        if (notesListBox.SelectedItem is string selectedDisplayName)
        {
            if (filePathMap.TryGetValue(selectedDisplayName, out string? fullPath))
            {
                OpenNoteEditor(fullPath);
            }
        }
    }
    
    private void OpenNoteEditor(string filePath)
    {
        var editor = new NoteEditorForm(filePath, notesManager);
        editor.ShowDialog();
        RefreshNotesList();
    }
    
    private void SetupFileWatcher(string folderPath)
    {
        fileWatcher?.Dispose();
        
        fileWatcher = new FileSystemWatcher(folderPath, "*.txt");
        fileWatcher.NotifyFilter = NotifyFilters.FileName | NotifyFilters.LastWrite;
        fileWatcher.Changed += (s, e) => RefreshNotesList();
        fileWatcher.Created += (s, e) => RefreshNotesList();
        fileWatcher.Deleted += (s, e) => RefreshNotesList();
        fileWatcher.Renamed += (s, e) => RefreshNotesList();
        fileWatcher.EnableRaisingEvents = true;
    }
    
    private void RefreshNotesList()
    {
        if (notesListBox.InvokeRequired)
        {
            notesListBox.Invoke(new Action(RefreshNotesList));
            return;
        }
        
        notesListBox.Items.Clear();
        filePathMap.Clear();
        
        var noteFiles = notesManager.GetNoteFiles();
        foreach (var file in noteFiles)
        {
            // Get just the file name without path
            string displayName = Path.GetFileNameWithoutExtension(file);
            
            // Add to list box and mapping dictionary
            notesListBox.Items.Add(displayName);
            filePathMap[displayName] = file;
        }
    }
    
    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        fileWatcher?.Dispose();
        base.OnFormClosing(e);
    }
}