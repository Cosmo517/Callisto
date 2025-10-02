import { useState } from 'react';
import { Switch } from 'react-aria-components';
import clsx from 'clsx';

interface ThemedSwitchProps {
    isSelected: boolean;
    onChange: (value: boolean) => void;
    text: string;
}

export function ThemedSwitch({
    isSelected,
    onChange,
    text,
}: ThemedSwitchProps) {
    return (
        <Switch
            isSelected={isSelected}
            onChange={onChange}
            className="group flex cursor-pointer items-center gap-3"
        >
            {({ isSelected, isDisabled }) => (
                <>
                    {/* Track */}
                    <div
                        className={clsx(
                            'flex h-6 w-12 items-center rounded-full px-1 transition-colors duration-300',
                            isSelected ? 'bg-accent-1' : 'bg-primary',
                            isDisabled && 'cursor-not-allowed opacity-50'
                        )}
                    >
                        {/* Thumb */}
                        <div
                            className={clsx(
                                'h-4 w-4 rounded-full shadow-md transition-transform duration-300',
                                isSelected
                                    ? 'bg-off-white translate-x-6'
                                    : 'bg-secondary translate-x-0'
                            )}
                        />
                    </div>

                    {/* Label */}
                    <span className="text-off-white text-sm font-medium">
                        List View
                    </span>
                </>
            )}
        </Switch>
    );
}
