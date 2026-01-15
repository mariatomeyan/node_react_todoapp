import { useState } from 'react';

export default function TodoItem({ todo, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const [desc, setDesc] = useState(todo.description || '');

    function toggle() {
        onUpdate(todo.id, { is_completed: !todo.is_completed });
    }

    function save() {
        if (title.trim()) {
            onUpdate(todo.id, { title: title.trim(), description: desc.trim() || null });
            setEditing(false);
        }
    }

    function cancel() {
        setTitle(todo.title);
        setDesc(todo.description || '');
        setEditing(false);
    }

    function onKey(e) {
        if (e.key === 'Escape') cancel();
    }

    if (editing) {
        return (
            <div className="p-4 bg-white rounded-xl border border-indigo-200 shadow-sm space-y-3">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={onKey}
                       className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       placeholder="Title" autoFocus />
                <textarea value={desc} onChange={e => setDesc(e.target.value)} onKeyDown={onKey}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          placeholder="Description (optional)" rows={2} />
                <div className="flex gap-2">
                    <button onClick={save} className="px-3 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">Save</button>
                    <button onClick={cancel} className="px-3 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${todo.is_completed ? 'opacity-60' : ''}`}>
            <button onClick={toggle}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${todo.is_completed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 hover:border-indigo-400'}`}>
                {todo.is_completed && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>
            <div className="flex-1 min-w-0">
                <span className={`block text-gray-700 ${todo.is_completed ? 'line-through text-gray-400' : ''}`}>{todo.title}</span>
                {todo.description && (
                    <p className={`mt-1 text-sm text-gray-500 ${todo.is_completed ? 'line-through' : ''}`}>{todo.description}</p>
                )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setEditing(true)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" title="Edit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button onClick={() => onDelete(todo.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
