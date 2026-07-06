import { create } from "zustand";

import type { HaEntity } from "./ha-types";

type HaStore = {
	entities: Record<string, HaEntity>;
	pendingEntityIds: Set<string>;

	isConnected: boolean;
	setConnected: (isConnected: boolean) => void;

	setEntities: (entities: HaEntity[]) => void;
	updateEntity: (entity: HaEntity) => void;

	markEntityAsPending: (entityId: string | string[]) => void;
	clearEntityPending: (entityId: string | string[]) => void;
	isEntityPending: (entityId: string) => boolean;
};

export const useHaStore = create<HaStore>((set, get) => ({
	entities: {},
	pendingEntityIds: new Set(),

	isConnected: false,
	setConnected: (isConnected) => set({ isConnected }),

	setEntities: (entities) =>
		set({
			entities: Object.fromEntries(
				entities.map((entity) => [entity.entity_id, entity]),
			),
		}),
	updateEntity: (entity) =>
		set((state) => {
			const nextPending = new Set(state.pendingEntityIds);
			nextPending.delete(entity.entity_id);

			return {
				entities: {
					...state.entities,
					[entity.entity_id]: entity,
				},
				pendingEntityIds: nextPending,
			};
		}),

	markEntityAsPending: (entityId) => {
		if (Array.isArray(entityId)) {
			set((state) => {
				const nextPending = new Set(state.pendingEntityIds);
				entityId.forEach((id) => {
					nextPending.add(id);
				});
				return { pendingEntityIds: nextPending };
			});
		} else {
			set((state) => ({
				pendingEntityIds: new Set(state.pendingEntityIds).add(entityId),
			}));
		}
	},
	clearEntityPending: (entityId) => {
		if (Array.isArray(entityId)) {
			set((state) => {
				const nextPending = new Set(state.pendingEntityIds);
				entityId.forEach((id) => {
					nextPending.delete(id);
				});
				return { pendingEntityIds: nextPending };
			});
		} else {
			set((state) => {
				const nextPending = new Set(state.pendingEntityIds);
				nextPending.delete(entityId);
				return { pendingEntityIds: nextPending };
			});
		}
	},
	isEntityPending: (entityId) => get().pendingEntityIds.has(entityId),
}));
