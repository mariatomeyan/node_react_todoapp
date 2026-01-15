import { useState } from 'react';
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from '../hooks/useTodos';
import TodoItem from './TodoItem';
import Header from './Header';

export default function TodoList() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [showDesc, setShowDesc] = useState(false);
    const { data: todos = [], isLoading, error } = useTodos();
    const createTodo = useCreateTodo();
    const updateTodo = useUpdateTodo();
    const deleteTodo = useDeleteTodo();

    function handleAdd(e) {
        e.preventDefault();
        if (!title.trim()) return;
        createTodo.mutate({ title: title.trim(), description: desc.trim() || null });
        setTitle('');
        setDesc('');
        setShowDesc(false);
    }

    const done = todos.filter(t => t.is_completed).length;
    const mutationErr = createTodo.error || updateTodo.error || deleteTodo.error;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
            <Header />
            <main className="max-w-2xl mx-auto px-4 py-8">
                <form onSubmit={handleAdd} className="mb-8">
                    <div className="flex gap-3">
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?"
                               className="flex-1 px-5 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                        <button type="submit" disabled={createTodo.isPending}
                                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all cursor-pointer disabled:opacity-50">
                            {createTodo.isPending ? (
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {!showDesc ? (
                        <button type="button" onClick={() => setShowDesc(true)} className="mt-2 text-sm text-gray-400 hover:text-indigo-600 cursor-pointer">
                            + Add description
                        </button>
                    ) : (
                        <textarea value={desc} onChange={e => setDesc(e.target.value)}
                                  className="mt-3 w-full px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                  placeholder="Description (optional)" rows={2} />
                    )}
                </form>

                {(error || mutationErr) && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error?.message || mutationErr?.message || 'Something went wrong'}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-12">
                        <svg className="animate-spin w-8 h-8 mx-auto text-indigo-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="mt-3 text-gray-500">Loading...</p>
                    </div>
                ) : todos.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-1">No todos yet</h3>
                        <p className="text-gray-500">Add your first task above</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {todos.map(todo => (
                                <TodoItem key={todo.id} todo={todo}
                                          onUpdate={(id, data) => updateTodo.mutate({ id, data })}
                                          onDelete={id => deleteTodo.mutate(id)} />
                            ))}
                        </div>
                        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                            <span>{todos.length} {todos.length === 1 ? 'task' : 'tasks'}</span>
                            <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                {done} completed
              </span>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
