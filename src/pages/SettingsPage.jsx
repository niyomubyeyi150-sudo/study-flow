import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import useDocumentTitle from "../hooks/useDocumentTitle";

const defaultSettings = {
  displayName: "",
  studyDuration: 25,
  compactMode: false,
};

function SettingsPage() {
  useDocumentTitle("Settings");

  const [savedSettings, setSavedSettings] = useLocalStorage(
    "studyflow-settings",
    defaultSettings,
  );

  const [settings, setSettings] = useState(savedSettings);

  // Update a setting without changing the other settings
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((previousSettings) => ({
      ...previousSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save settings to localStorage
  const handleSubmit = (event) => {
    event.preventDefault();

    setSavedSettings({
      ...settings,
      studyDuration: Number(settings.studyDuration),
    });

    alert("Your settings have been saved!");
  };

  // Restore default settings
  const handleReset = () => {
    setSettings(defaultSettings);
    setSavedSettings(defaultSettings);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Page heading */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8795D]">
            Workspace preferences
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#302B32]">
            Settings
          </h1>

          <p className="mt-2 text-sm text-[#897D76]">
            Manage your account preferences and customize your HubNest
            experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile section */}
          <section className="overflow-hidden rounded-2xl border border-[#E8DED6] bg-white">
            <div className="border-b border-[#EEE7E1] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7E9E2] text-[#C8795D]">
                  <span className="text-lg">♙</span>
                </div>

                <div>
                  <h2 className="font-semibold text-[#302B32]">Profile</h2>
                  <p className="text-sm text-[#897D76]">
                    Personalize your workspace identity.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <label
                  htmlFor="displayName"
                  className="font-medium text-[#302B32]"
                >
                  Display name
                </label>

                <p className="mt-1 text-sm text-[#897D76]">
                  This name will appear in your workspace.
                </p>
              </div>

              <input
                id="displayName"
                type="text"
                name="displayName"
                value={settings.displayName}
                onChange={handleChange}
                placeholder="Your name"
                maxLength={40}
                className="w-full rounded-xl border border-[#E8DED6] bg-[#FDFBF9] px-4 py-2.5 text-sm text-[#302B32] outline-none transition placeholder:text-[#B5AAA2] focus:border-[#C8795D] focus:ring-2 focus:ring-[#C8795D]/10 sm:max-w-xs"
              />
            </div>
          </section>

          {/* Study preferences */}
          <section className="overflow-hidden rounded-2xl border border-[#E8DED6] bg-white">
            <div className="border-b border-[#EEE7E1] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EDE4] text-[#8B705D]">
                  <span className="text-lg">◷</span>
                </div>

                <div>
                  <h2 className="font-semibold text-[#302B32]">
                    Study preferences
                  </h2>
                  <p className="text-sm text-[#897D76]">
                    Adjust your focus session settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <label
                  htmlFor="studyDuration"
                  className="font-medium text-[#302B32]"
                >
                  Focus session duration
                </label>

                <p className="mt-1 text-sm text-[#897D76]">
                  Choose how long you want each study session to last.
                </p>
              </div>

              <select
                id="studyDuration"
                name="studyDuration"
                value={settings.studyDuration}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E8DED6] bg-[#FDFBF9] px-4 py-2.5 text-sm text-[#302B32] outline-none transition focus:border-[#C8795D] focus:ring-2 focus:ring-[#C8795D]/10 sm:max-w-xs"
              >
                <option value={15}>15 minutes</option>
                <option value={25}>25 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <div className="border-t border-[#EEE7E1] px-6 py-4">
              <p className="text-xs text-[#897D76]">
                Your selected duration will be used by the Focus Timer.
              </p>
            </div>
          </section>

          {/* Appearance section */}
          <section className="overflow-hidden rounded-2xl border border-[#E8DED6] bg-white">
            <div className="border-b border-[#EEE7E1] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECEBE5] text-[#777466]">
                  <span className="text-lg">◐</span>
                </div>

                <div>
                  <h2 className="font-semibold text-[#302B32]">Appearance</h2>
                  <p className="text-sm text-[#897D76]">
                    Customize how your workspace looks.
                  </p>
                </div>
              </div>
            </div>

            <label
              htmlFor="compactMode"
              className="flex cursor-pointer items-center justify-between gap-5 px-6 py-5"
            >
              <div>
                <span className="font-medium text-[#302B32]">Compact mode</span>

                <p className="mt-1 text-sm text-[#897D76]">
                  Use smaller spacing throughout your workspace.
                </p>
              </div>

              <input
                id="compactMode"
                type="checkbox"
                name="compactMode"
                checked={settings.compactMode}
                onChange={handleChange}
                className="h-5 w-5 shrink-0 cursor-pointer accent-[#C8795D]"
              />
            </label>
          </section>

          {/* Action buttons */}
          <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#E8DED6] pt-6 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl px-5 py-3 text-sm font-medium text-[#897D76] transition hover:bg-[#EDE5DE] hover:text-[#302B32]"
            >
              Reset to defaults
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#C8795D] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B9694F] focus:outline-none focus:ring-2 focus:ring-[#C8795D] focus:ring-offset-2"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;
