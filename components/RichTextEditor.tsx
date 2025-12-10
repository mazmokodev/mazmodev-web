
import React, { useEffect, useRef, useState } from 'react';
import { Icons } from './Icons';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  label, 
  placeholder = 'Tulis konten di sini...',
  minHeight = '300px'
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  // Sync value from props to editable div ONLY when not focused or empty
  useEffect(() => {
    if (contentRef.current) {
        const shouldUpdate = contentRef.current.innerHTML !== value && !isFocused;
        const isInitial = contentRef.current.innerHTML === '' && value;

        if (shouldUpdate || isInitial) {
            contentRef.current.innerHTML = value;
        }
    }
  }, [value, isFocused]);

  // Check which formats are active at current cursor position
  const checkActiveFormats = () => {
      const formats: string[] = [];
      
      // Boolean commands
      ['bold', 'italic', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList'].forEach(cmd => {
          if (document.queryCommandState(cmd)) {
              formats.push(cmd);
          }
      });

      // Value commands (Headings)
      const blockValue = document.queryCommandValue('formatBlock');
      if (blockValue) {
          formats.push(blockValue.toLowerCase()); // returns 'h2', 'h3', 'p', 'div'
      }

      setActiveFormats(formats);
  };

  const handleInput = () => {
    if (contentRef.current) {
      const html = contentRef.current.innerHTML;
      if (html !== value) {
        onChange(html);
      }
    }
    checkActiveFormats();
  };

  const execCommand = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    // Ensure focus remains on editor
    if (contentRef.current) {
        contentRef.current.focus();
    }
    handleInput(); // Trigger change immediately
  };

  interface ToolbarBtnProps {
      icon: any;
      command: string;
      arg?: string;
      title: string;
      checkValue?: string; // value to check against for active state (specifically for formatBlock)
  }

  const ToolbarButton = ({ icon: Icon, command, arg, title, checkValue }: ToolbarBtnProps) => {
    // Determine active state
    let isActive = false;
    if (command === 'formatBlock') {
        isActive = activeFormats.includes(arg?.toLowerCase() || '');
    } else {
        isActive = activeFormats.includes(command);
    }

    return (
        <button
        type="button"
        onMouseDown={(e) => { 
            e.preventDefault(); // Prevent focus loss 
            execCommand(command, arg); 
        }}
        className={`p-2 rounded transition-colors ${
            isActive 
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold' 
            : 'hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
        }`}
        title={title}
        >
        <Icon size={18} />
        </button>
    );
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-bold mb-2 dark:text-white">{label}</label>}
      
      <div className={`border rounded-lg overflow-hidden bg-white dark:bg-slate-900 transition-colors ${isFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 dark:border-slate-700'}`}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 select-none sticky top-0 z-10">
            <ToolbarButton icon={Icons.Bold} command="bold" title="Bold" />
            <ToolbarButton icon={Icons.Italic} command="italic" title="Italic" />
            <ToolbarButton icon={Icons.Underline} command="underline" title="Underline" />
            
            <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1"></div>
            
            <ToolbarButton icon={Icons.Heading1} command="formatBlock" arg="H2" title="Heading 2" />
            <ToolbarButton icon={Icons.Heading2} command="formatBlock" arg="H3" title="Heading 3" />
            
            <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1"></div>

            <ToolbarButton icon={Icons.AlignLeft} command="justifyLeft" title="Align Left" />
            <ToolbarButton icon={Icons.AlignCenter} command="justifyCenter" title="Align Center" />
            <ToolbarButton icon={Icons.AlignRight} command="justifyRight" title="Align Right" />
            <ToolbarButton icon={Icons.AlignJustify} command="justifyFull" title="Justify" />

            <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1"></div>
            
            <ToolbarButton icon={Icons.List} command="insertUnorderedList" title="Bullet List" />
            <ToolbarButton icon={Icons.ListOrdered} command="insertOrderedList" title="Number List" />
            
            <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1"></div>
            
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    const url = prompt('Masukkan URL Link:');
                    if (url) execCommand('createLink', url);
                }}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                title="Insert Link"
            >
                <Icons.LinkIcon size={18} />
            </button>
            <ToolbarButton icon={Icons.Undo} command="undo" title="Undo" />
        </div>

        {/* Editor Area */}
        <div
          ref={contentRef}
          className="prose prose-sm dark:prose-invert max-w-none p-4 focus:outline-none overflow-y-auto prose-li:list-disc prose-ol:list-decimal prose-headings:font-bold"
          contentEditable
          onInput={handleInput}
          onBlur={() => { setIsFocused(false); handleInput(); }}
          onFocus={() => setIsFocused(true)}
          onKeyUp={checkActiveFormats} // Check formats on key release (e.g. arrow keys)
          onMouseUp={checkActiveFormats} // Check formats on mouse click/select
          style={{ minHeight: minHeight }}
          data-placeholder={placeholder}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1 text-right">WYSIWYG Mode Active</p>
    </div>
  );
};
