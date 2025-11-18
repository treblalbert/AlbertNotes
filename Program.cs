using Microsoft.Win32;

namespace NotesWidget;

static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();
        
        // Create and show the main widget form
        var mainForm = new MainWidgetForm();
        
        // Set up startup registration
        StartupManager.RegisterForStartup();
        
        Application.Run(mainForm);
    }
}