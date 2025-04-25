import React, { useState } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
// Add more languages if needed

const languageExtensions = {
  python3: python(),
  cpp17: cpp(),
  java: java(),
};

const languages = [
  { label: 'Python 3', value: 'python3', versionIndex: '3', sample: "print('Hello, Python!')" },
  { label: 'C++ 17', value: 'cpp17', versionIndex: '0', sample: "#include <iostream>\nint main() {\n  std::cout << \"Hello, C++!\";\n  return 0;\n}" },
  { label: 'Java', value: 'java', versionIndex: '4', sample: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, Java!\");\n  }\n}" },
  { label: 'C', value: 'c', versionIndex: '5', sample: "#include <stdio.h>\nint main() {\n  printf(\"Hello, C!\\n\");\n  return 0;\n}" },
  { label: 'JavaScript', value: 'nodejs', versionIndex: '4', sample: "console.log('Hello, JavaScript!');" },
  { label: 'PHP', value: 'php', versionIndex: '3', sample: "<?php\necho 'Hello, PHP!';\n?>" },
  { label: 'Ruby', value: 'ruby', versionIndex: '3', sample: "puts 'Hello, Ruby!'" },
  { label: 'Go', value: 'go', versionIndex: '3', sample: "package main\nimport \"fmt\"\nfunc main() {\n  fmt.Println(\"Hello, Go!\")\n}" },
  { label: 'Swift', value: 'swift', versionIndex: '3', sample: "print(\"Hello, Swift!\")" },
];

export default function Compiler() {
  const [language, setLanguage] = useState('python3');
  const [versionIndex, setVersionIndex] = useState('3');
  const [code, setCode] = useState(languages[0].sample);
  const [output, setOutput] = useState('');

  const runCode = async () => {
    try {
      const res = await axios.post('https://ironfist.pythonanywhere.com/api/compile', {
        script: code,
        language,
        versionIndex,
      });
      setOutput(res.data.output || 'No output received.');
    } catch (err) {
      setOutput('Error running code');
    }
  };

  const handleLangChange = (e) => {
    const selected = languages.find((l) => l.value === e.target.value);
    setLanguage(selected.value);
    setVersionIndex(selected.versionIndex);
    setCode(selected.sample);
  };

  return (
    <div className="space-y-5">
      <select
        className="p-2 bg-gray-800 text-white rounded"
        value={language}
        onChange={handleLangChange}
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>

      <CodeMirror
        value={code}
        height="500px"
        extensions={[languageExtensions[language] || python()]}
        theme="dark"
        onChange={(value) => setCode(value)}
      />

      <button
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        onClick={runCode}
      >
        Run
      </button>

      <div className="bg-black text-green-400 p-2 rounded min-h-[100px] whitespace-pre-wrap">
        {output}
      </div>
    </div>
  );
}
