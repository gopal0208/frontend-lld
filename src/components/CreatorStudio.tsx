import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Check, Save, Download, Terminal, UploadCloud, Loader2 } from 'lucide-react';

interface CodeFileField {
  filename: string;
  code: string;
  language: string;
}

interface CreatorStudioProps {
  onSave: (newItem: any, type: 'pattern' | 'challenge') => void;
  onClose: () => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({ onSave, onClose }) => {
  const [contentType, setContentType] = useState<'pattern' | 'challenge'>('challenge');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [tagsInput, setTagsInput] = useState('');
  const [frameworksInput, setFrameworksInput] = useState('React, Vanilla');
  const [videoUrl, setVideoUrl] = useState('');
  const [codeSandboxUrl, setCodeSandboxUrl] = useState('');
  const [diagram, setDiagram] = useState('');
  
  // Theory/Details fields
  const [problemStatement, setProblemStatement] = useState('');
  const [bulletsInput, setBulletsInput] = useState('');
  const [patternsInput, setPatternsInput] = useState('');
  const [takeawaysInput, setTakeawaysInput] = useState('');

  // Code files fields
  const [codeFiles, setCodeFiles] = useState<CodeFileField[]>([
    { filename: 'index.ts', code: '// Write code here...', language: 'typescript' }
  ]);

  // Imgur upload configurations
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgurClientId, setImgurClientId] = useState(() => localStorage.getItem('lld_hub_imgur_client_id') || '');
  const [isUploading, setIsUploading] = useState(false);
  const [jsonExport, setJsonExport] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('lld_hub_imgur_client_id', imgurClientId);
  }, [imgurClientId]);

  const handleAddCodeFile = () => {
    setCodeFiles([...codeFiles, { filename: 'helper.ts', code: '// Write code here...', language: 'typescript' }]);
  };

  const handleRemoveCodeFile = (idx: number) => {
    setCodeFiles(codeFiles.filter((_, i) => i !== idx));
  };

  const handleCodeFileChange = (idx: number, key: keyof CodeFileField, value: string) => {
    setCodeFiles(
      codeFiles.map((file, i) => (i === idx ? { ...file, [key]: value } : file))
    );
  };

  // Local Base64 conversion fallback
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB! Please select a smaller image.');
        return;
      }
      setSelectedFile(file);
      
      // Default fallback: convert to base64 immediately so there is some preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDiagram(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct anonymous upload to Imgur
  const handleCloudUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image file first!');
      return;
    }
    if (!imgurClientId.trim()) {
      alert('Please enter an Imgur Client-ID first to authenticate cloud uploads!');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${imgurClientId.trim()}`
        },
        body: formData
      });

      const resData = await response.json();
      if (resData.success && resData.data?.link) {
        setDiagram(resData.data.link);
        alert('Success! Diagram uploaded to Imgur cloud and linked successfully.');
      } else {
        throw new Error(resData.data?.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error(err);
      alert(`Cloud upload failed: ${err.message || 'Make sure your Imgur Client-ID is valid.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const generateJson = () => {
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const frameworks = frameworksInput.split(',').map((f) => f.trim()).filter(Boolean);
    const bullets = bulletsInput.split('\n').map((t) => t.trim()).filter(Boolean);
    const patternsUsed = patternsInput.split('\n').map((t) => t.trim()).filter(Boolean);
    const takeaways = takeawaysInput.split('\n').map((t) => t.trim()).filter(Boolean);

    const baseObject: any = {
      id: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title,
      description,
      frameworks,
      diagram: diagram || '\n+--------------------------+\n|      SYSTEM DIAGRAM      |\n+--------------------------+\n',
      codeFiles,
      codeSandboxUrl: codeSandboxUrl.trim() || undefined,
    };

    if (contentType === 'challenge') {
      baseObject.difficulty = difficulty;
      baseObject.tags = tags;
      baseObject.media = videoUrl ? { type: videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? 'youtube' : 'local', url: videoUrl } : { type: 'none', url: '' };
      baseObject.theory = {
        problemStatement,
        coreChallenges: bullets,
        designPatterns: patternsUsed,
        keyTakeaways: takeaways,
      };
    } else {
      baseObject.theory = {
        intent: problemStatement,
        whenToUse: bullets,
        prosAndCons: {
          pros: patternsUsed,
          cons: takeaways,
        },
      };
    }

    return JSON.stringify(baseObject, null, 2);
  };

  const handleExport = () => {
    if (!title) {
      alert('Please provide a Title first!');
      return;
    }
    const json = generateJson();
    setJsonExport(json);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonExport).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveToLocal = () => {
    if (!title) {
      alert('Please provide a Title first!');
      return;
    }
    const jsonStr = generateJson();
    const parsedObj = JSON.parse(jsonStr);
    onSave(parsedObj, contentType);
    alert(`"${title}" has been successfully added to your local browser storage!`);
    onClose();
  };

  return (
    <div className="glass-panel" style={{
      padding: '2rem',
      background: 'rgba(10, 15, 30, 0.95)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      maxHeight: '85vh',
      overflowY: 'auto',
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      animation: 'fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }} className="gradient-text">LLD Creator Studio</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Design study material via the UI. Export JSON to update public/lld_database.json.</p>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--border-color)', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Close</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Side: Metadata Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="playground-knob">
            <label>Content Category</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button
                onClick={() => setContentType('challenge')}
                style={{
                  flex: 1,
                  background: contentType === 'challenge' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                  borderColor: contentType === 'challenge' ? 'var(--accent-purple)' : 'var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              >
                Design Challenge (Interactive Widget)
              </button>
              <button
                onClick={() => setContentType('pattern')}
                style={{
                  flex: 1,
                  background: contentType === 'pattern' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                  borderColor: contentType === 'pattern' ? 'var(--accent-cyan)' : 'var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              >
                Isolated Design Pattern
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
            <div className="playground-knob">
              <label>Title</label>
              <input
                type="text"
                placeholder="e.g., Virtualized List"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.5rem', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
              />
            </div>

            {contentType === 'challenge' ? (
              <div className="playground-knob">
                <label>Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e: any) => setDifficulty(e.target.value)}
                  className="playground-select"
                  style={{ width: '100%' }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            ) : (
              <div className="playground-knob">
                <label>Type Badge</label>
                <input
                  type="text"
                  disabled
                  value="Design Pattern"
                  style={{ background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', padding: '0.5rem', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', cursor: 'not-allowed' }}
                />
              </div>
            )}
          </div>

          <div className="playground-knob">
            <label>Description</label>
            <textarea
              placeholder="Provide a brief summary of what this topic teaches..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.5rem', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', resize: 'vertical', outline: 'none' }}
            />
          </div>

          <div className="playground-knob">
            <label>Supported Frameworks (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., React, Vanilla, Angular, Vue"
              value={frameworksInput}
              onChange={(e) => setFrameworksInput(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.5rem', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
            />
          </div>

          <div className="playground-knob">
            <label>CodeSandbox / StackBlitz Embed URL (Optional)</label>
            <input
              type="text"
              placeholder="e.g., https://codesandbox.io/embed/react-todo-app-xyz?fontsize=14&hidenavigation=1"
              value={codeSandboxUrl}
              onChange={(e) => setCodeSandboxUrl(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.5rem', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
            />
          </div>

          {contentType === 'challenge' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem' }}>
              <div className="playground-knob">
                <label>Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Performance, Hooks"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.5rem', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                />
              </div>

              <div className="playground-knob">
                <label>Video URL / Path</label>
                <input
                  type="text"
                  placeholder="YouTube URL or local path /videos/xxx.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.5rem', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                />
              </div>
            </div>
          )}

          <div className="playground-knob">
            <label>{contentType === 'challenge' ? 'Problem Statement' : 'Pattern Intent'}</label>
            <textarea
              placeholder={contentType === 'challenge' ? 'Describe the problem this challenge solves...' : 'Define the primary intent of this pattern...'}
              rows={3}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.5rem', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', resize: 'vertical', outline: 'none' }}
            />
          </div>

          {/* Architecture Diagram with Cloud uploader settings */}
          <div className="playground-knob">
            <label>Architecture Diagram (Cloud Image, Base64, or ASCII)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.25rem' }}>
              {/* Cloud uploader credentials input */}
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.4rem 0.6rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>IMGUR CLIENT ID:</span>
                <input
                  type="password"
                  placeholder="Paste free Imgur Client-ID..."
                  value={imgurClientId}
                  onChange={(e) => setImgurClientId(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="studio-diagram-file-select"
                />
                <label
                  htmlFor="studio-diagram-file-select"
                  className="btn"
                  style={{
                    fontSize: '0.76rem',
                    padding: '0.4rem 0.8rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(255,255,255,0.04)',
                  }}
                >
                  📁 Select Local Image
                </label>

                {selectedFile && (
                  <button
                    onClick={handleCloudUpload}
                    disabled={isUploading}
                    className="btn"
                    style={{
                      fontSize: '0.76rem',
                      padding: '0.4rem 0.8rem',
                      background: 'rgba(6, 182, 212, 0.12)',
                      borderColor: 'var(--accent-cyan)',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    {isUploading ? (
                      <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <UploadCloud size={12} />
                    )}
                    <span>{isUploading ? 'Uploading...' : 'Upload to Cloud'}</span>
                  </button>
                )}

                {diagram && (
                  <button
                    onClick={() => {
                      setDiagram('');
                      setSelectedFile(null);
                    }}
                    style={{ fontSize: '0.76rem', padding: '0.4rem 0.8rem', border: '1px solid var(--error)', color: 'var(--error)', background: 'transparent' }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {diagram.startsWith('data:image/') || diagram.startsWith('http') ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-color)',
                }}>
                  <img
                    src={diagram}
                    alt="Diagram Preview"
                    style={{ maxWidth: '100%', maxHeight: '140px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                  />
                  <span style={{ fontSize: '0.68rem', color: diagram.startsWith('http') ? 'var(--success)' : 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                    {diagram.startsWith('http') ? 'Linked via Cloud CDN (Optimized!)' : 'Linked via Local Base64 String'}
                  </span>
                </div>
              ) : (
                <textarea
                  placeholder="Or paste public CDN link OR write ASCII text flowcharts here..."
                  rows={4}
                  value={diagram}
                  onChange={(e) => setDiagram(e.target.value)}
                  style={{ background: '#000', border: '1px solid var(--border-color)', padding: '0.5rem', color: 'var(--accent-cyan)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', resize: 'vertical', outline: 'none' }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Code Files & Theory Points */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="playground-knob">
            <label>
              {contentType === 'challenge'
                ? 'Engineering Challenges (one per line)'
                : 'When to Use? (one per line)'}
            </label>
            <textarea
              placeholder="List items..."
              rows={2}
              value={bulletsInput}
              onChange={(e) => setBulletsInput(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.5rem', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', resize: 'vertical', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="playground-knob">
              <label>
                {contentType === 'challenge'
                  ? 'Design Patterns Used (one per line)'
                  : 'Advantages (one per line)'}
              </label>
              <textarea
                placeholder="List items..."
                rows={3}
                value={patternsInput}
                onChange={(e) => setPatternsInput(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.5rem', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', resize: 'vertical', outline: 'none' }}
              />
            </div>

            <div className="playground-knob">
              <label>
                {contentType === 'challenge'
                  ? 'LLD Best Practices (one per line)'
                  : 'Trade-offs & Cons (one per line)'}
              </label>
              <textarea
                placeholder="List items..."
                rows={3}
                value={takeawaysInput}
                onChange={(e) => setTakeawaysInput(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.5rem', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', resize: 'vertical', outline: 'none' }}
              />
            </div>
          </div>

          {/* Dynamic Code File Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>TypeScript Code Files</label>
              <button
                onClick={handleAddCodeFile}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.7rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <Plus size={10} /> Add File
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {codeFiles.map((file, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="filename.ts"
                      value={file.filename}
                      onChange={(e) => handleCodeFileChange(idx, 'filename', e.target.value)}
                      style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.3rem 0.5rem', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '0.75rem', outline: 'none', fontFamily: 'var(--font-mono)' }}
                    />
                    
                    <select
                      value={file.language}
                      onChange={(e) => handleCodeFileChange(idx, 'language', e.target.value)}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.75rem', borderRadius: '4px' }}
                    >
                      <option value="typescript">TypeScript</option>
                      <option value="javascript">JavaScript</option>
                      <option value="css">CSS</option>
                    </select>

                    {codeFiles.length > 1 && (
                      <button
                        onClick={() => handleRemoveCodeFile(idx)}
                        style={{ border: 'none', background: 'transparent', padding: '0.25rem', color: 'var(--text-muted)', cursor: 'pointer', transform: 'none' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  
                  <textarea
                    placeholder="// Write TypeScript code..."
                    rows={4}
                    value={file.code}
                    onChange={(e) => handleCodeFileChange(idx, 'code', e.target.value)}
                    style={{ background: 'rgb(8, 10, 19)', border: '1px solid var(--border-color)', padding: '0.5rem', color: '#fff', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', resize: 'vertical', outline: 'none' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer studio action buttons */}
      <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
        <button onClick={handleSaveToLocal} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
          <Save size={16} /> Save to Browser Storage
        </button>
        <button onClick={handleExport} style={{ border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
          <Download size={16} /> Export JSON Config
        </button>
      </div>

      {/* Export Output Panel */}
      {jsonExport && (
        <div className="glass-panel" style={{
          marginTop: '2rem',
          background: '#040711',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          animation: 'fade-in 0.25s ease-out',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              &gt; lld_database_export.json
            </span>
            <button
              onClick={handleCopyJson}
              style={{
                fontSize: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              {copied ? <Check size={12} style={{ color: 'var(--success)' }} /> : <Copy size={12} />}
              <span>{copied ? 'Copied!' : 'Copy configuration'}</span>
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Copy this block and append it inside the <code>"patterns"</code> or <code>"challenges"</code> array inside <code>public/lld_database.json</code> to make it permanent for all users!
          </p>
          <pre style={{
            background: 'rgba(0,0,0,0.4)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            maxHeight: '250px',
            overflowY: 'auto',
          }}>
            <code>{jsonExport}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
