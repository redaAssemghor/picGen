import { useState } from "react";

const Prompt = () => {
  const [prompt, setPrompt] = useState("");
  return (
    <div>
      <h1>AI Image Generator</h1>
      <form>
        <textarea
          name="prompt"
          placeholder="Description prompt"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        ></textarea>
        <div>
          <button>clear</button>
          <button>run</button>
        </div>
        <button type="submit">Generate</button>
      </form>
    </div>
  );
};

export default Prompt;
