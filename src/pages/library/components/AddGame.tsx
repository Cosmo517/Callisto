import { invoke } from '@tauri-apps/api/core';
import { Game } from '../../../common/interfaces/GameInterface';
import { useEffect, useState } from 'react';
import { Selection } from '@react-types/shared';

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react';

interface AddGameDialogProps {
    open: boolean;
    onClose: () => void;
}

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import GameTable from './GameTable';
import { useUser } from '../../../common/UserContext';

function AddGame({ open, onClose }: AddGameDialogProps) {
    if (!open) return null;

    const [games, setGames] = useState<Game[]>([]);
    const [selectedGames, setSelectedGames] = useState<Selection>(new Set());
    const { user } = useUser();

    useEffect(() => {
        invoke<Game[]>('tauri_retrieve_all_games')
            .then((data) => {
                setGames(data);
                console.log(data);
            })
            .catch((err) => console.error('Error fetching users:', err));
    }, []);

    const onSubmit = async () => {
        const ids = Array.from(selectedGames).map((id) =>
            parseInt(id as string, 10)
        );
        try {
            await invoke('tauri_add_user_games', {
                userId: Number(user.id),
                gameIds: ids,
            });
            onClose();
            console.log('Games added successfully!');
        } catch (err) {
            console.error('Failed to add games:', err);
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={onClose} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-full overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-6xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
                                        <ExclamationTriangleIcon
                                            aria-hidden="true"
                                            className="size-6 text-red-400"
                                        />
                                    </div>
                                    <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle
                                            as="h3"
                                            className="text-base font-semibold text-white"
                                        >
                                            Choose the games you want to add to
                                            your profile
                                        </DialogTitle>

                                        <div className="mt-4 max-h-[70vh] overflow-y-auto rounded-lg p-2">
                                            <GameTable
                                                games={games}
                                                selectedGames={selectedGames}
                                                setSelectedGames={
                                                    setSelectedGames
                                                }
                                                onRowClick={(g) =>
                                                    console.log(
                                                        'clicked',
                                                        g.app_id
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    onClick={() => onSubmit()}
                                    className="bg-accent-1 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                                >
                                    Add games
                                </button>
                                <button
                                    type="button"
                                    data-autofocus
                                    onClick={onClose}
                                    className="bg-secondary text-off-white mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default AddGame;
