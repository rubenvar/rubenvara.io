import type { Post } from '$lib/utils/types';
import { writable } from 'svelte/store';

export const latestPosts = writable<Post[]>([]);
