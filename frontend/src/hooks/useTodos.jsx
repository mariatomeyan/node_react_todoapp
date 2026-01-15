import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todos } from '../api';

const KEY = ['todos'];

export function useTodos() {
    return useQuery({
        queryKey: KEY,
        queryFn: () => todos.getAll().then(r => r.data)
    });
}

export function useCreateTodo() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ title, description }) => todos.create(title, description).then(r => r.data),
        onMutate: async ({ title, description }) => {
            await qc.cancelQueries({ queryKey: KEY });
            const prev = qc.getQueryData(KEY);
            qc.setQueryData(KEY, old => [
                { id: Date.now(), title, description, is_completed: false, temp: true },
                ...(old || [])
            ]);
            return { prev };
        },
        onError: (err, vars, ctx) => qc.setQueryData(KEY, ctx.prev),
        onSettled: () => qc.invalidateQueries({ queryKey: KEY })
    });
}

export function useUpdateTodo() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => todos.update(id, data).then(r => r.data),
        onMutate: async ({ id, data }) => {
            await qc.cancelQueries({ queryKey: KEY });
            const prev = qc.getQueryData(KEY);
            qc.setQueryData(KEY, old => old?.map(t => t.id === id ? { ...t, ...data } : t));
            return { prev };
        },
        onError: (err, vars, ctx) => qc.setQueryData(KEY, ctx.prev),
        onSettled: () => qc.invalidateQueries({ queryKey: KEY })
    });
}

export function useDeleteTodo() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id) => todos.delete(id).then(() => id),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: KEY });
            const prev = qc.getQueryData(KEY);
            qc.setQueryData(KEY, old => old?.filter(t => t.id !== id));
            return { prev };
        },
        onError: (err, id, ctx) => qc.setQueryData(KEY, ctx.prev),
        onSettled: () => qc.invalidateQueries({ queryKey: KEY })
    });
}
