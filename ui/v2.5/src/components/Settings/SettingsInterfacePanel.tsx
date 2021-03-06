import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { DurationInput, LoadingIndicator } from "src/components/Shared";
import { StashService } from "src/core/StashService";
import { useToast } from "src/hooks";

export const SettingsInterfacePanel: React.FC = () => {
  const Toast = useToast();
  const { data: config, error, loading } = StashService.useConfiguration();
  const [soundOnPreview, setSoundOnPreview] = useState<boolean>(true);
  const [wallShowTitle, setWallShowTitle] = useState<boolean>(true);
  const [maximumLoopDuration, setMaximumLoopDuration] = useState<number>(0);
  const [autostartVideo, setAutostartVideo] = useState<boolean>(false);
  const [showStudioAsText, setShowStudioAsText] = useState<boolean>(false);
  const [css, setCSS] = useState<string>();
  const [cssEnabled, setCSSEnabled] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");

  const [updateInterfaceConfig] = StashService.useConfigureInterface({
    soundOnPreview,
    wallShowTitle,
    maximumLoopDuration,
    autostartVideo,
    showStudioAsText,
    css,
    cssEnabled,
    language
  });

  useEffect(() => {
    const iCfg = config?.configuration?.interface;
    setSoundOnPreview(iCfg?.soundOnPreview ?? true);
    setWallShowTitle(iCfg?.wallShowTitle ?? true);
    setMaximumLoopDuration(iCfg?.maximumLoopDuration ?? 0);
    setAutostartVideo(iCfg?.autostartVideo ?? false);
    setShowStudioAsText(iCfg?.showStudioAsText ?? false);
    setCSS(iCfg?.css ?? "");
    setCSSEnabled(iCfg?.cssEnabled ?? false);
    setLanguage(iCfg?.language ?? "en-US");
  }, [config]);

  async function onSave() {
    try {
      const result = await updateInterfaceConfig();
      // eslint-disable-next-line no-console
      console.log(result);
      Toast.success({ content: "Updated config" });
    } catch (e) {
      Toast.error(e);
    }
  }

  if (error) return <h1>{error.message}</h1>;
  if (loading) return <LoadingIndicator />;

  return (
    <>
      <h4>User Interface</h4>
      <Form.Group controlId="language">
        <h6>Language</h6>
        <Form.Control
          as="select"
          className="col-4 input-control"
          value={language}
          onChange={(e: React.FormEvent<HTMLSelectElement>) =>
            setLanguage(e.currentTarget.value)
          }
        >
          <option value="en-US">English (United States)</option>
          <option value="en-GB">English (United Kingdom)</option>
          <option value="de-DE">Deutsch</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <h5>Scene / Marker Wall</h5>
        <Form.Check
          id="wall-show-title"
          checked={wallShowTitle}
          label="Display title and tags"
          onChange={() => setWallShowTitle(!wallShowTitle)}
        />
        <Form.Check
          id="wall-sound-enabled"
          checked={soundOnPreview}
          label="Enable sound"
          onChange={() => setSoundOnPreview(!soundOnPreview)}
        />
        <Form.Text className="text-muted">
          Configuration for wall items
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <h5>Scene List</h5>
        <Form.Check
          id="show-text-studios"
          checked={showStudioAsText}
          label="Show Studios as text"
          onChange={() => {
            setShowStudioAsText(!showStudioAsText);
          }}
        />
      </Form.Group>

      <Form.Group>
        <h5>Scene Player</h5>
        <Form.Group id="auto-start-video">
          <Form.Check
            checked={autostartVideo}
            label="Auto-start video"
            onChange={() => {
              setAutostartVideo(!autostartVideo);
            }}
          />
        </Form.Group>

        <Form.Group id="max-loop-duration">
          <h6>Maximum loop duration</h6>
          <DurationInput
            className="row col col-4"
            numericValue={maximumLoopDuration}
            onValueChange={duration => setMaximumLoopDuration(duration)}
          />
          <Form.Text className="text-muted">
            Maximum scene duration where scene player will loop the video - 0 to
            disable
          </Form.Text>
        </Form.Group>
      </Form.Group>

      <Form.Group>
        <h5>Custom CSS</h5>
        <Form.Check
          id="custom-css"
          checked={cssEnabled}
          label="Custom CSS enabled"
          onChange={() => {
            setCSSEnabled(!cssEnabled);
          }}
        />

        <Form.Control
          as="textarea"
          value={css}
          onChange={(e: React.FormEvent<HTMLTextAreaElement>) =>
            setCSS(e.currentTarget.value)
          }
          rows={16}
          className="col col-sm-6 text-input code"
        ></Form.Control>
        <Form.Text className="text-muted">
          Page must be reloaded for changes to take effect.
        </Form.Text>
      </Form.Group>

      <hr />
      <Button variant="primary" onClick={() => onSave()}>
        Save
      </Button>
    </>
  );
};
