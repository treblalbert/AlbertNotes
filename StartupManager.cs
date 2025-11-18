using Microsoft.Win32;

namespace NotesWidget;

public static class StartupManager
{
    private const string AppName = "NotesWidget";
    
    public static void RegisterForStartup()
    {
        try
        {
            using (var key = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Run", true))
            {
                var exePath = System.Diagnostics.Process.GetCurrentProcess().MainModule?.FileName;
                
                if (exePath != null)
                {
                    key?.SetValue(AppName, $"\"{exePath}\"");
                }
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Startup registration failed: {ex.Message}");
        }
    }
    
    public static void UnregisterFromStartup()
    {
        try
        {
            using (var key = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Run", true))
            {
                key?.DeleteValue(AppName, false);
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Startup unregistration failed: {ex.Message}");
        }
    }
}