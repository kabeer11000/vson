import React, { memo, useCallback, useMemo } from 'react';

interface IJSONEditorSchemaItem {
    type: "object" | "string" | "number" | "array" | "big-string" | "select" | "boolean";
    mutateable: boolean;
    InputProps?: Record<string, any>;
    name?: string;
    value: IJSONEditorSchemaItem | string | number | IJSONEditorSchema;
    options?: Array<{ value: string | number | boolean; label: string }>;
}

interface IJSONEditorSchema {
    [x: string]: IJSONEditorSchemaItem;
}

interface JSONEditorProps {
    data: object | Array<object>;
    schema: IJSONEditorSchema;
    onDataChange: (data: object) => void;
}

// Optimized getValue with memoization potential
const getValue = (obj: any, keys: string[]): any => {
    if (!obj || !keys.length) return obj;
    
    let current = obj;
    for (const key of keys) {
        if (current == null) return undefined;
        current = current[key];
    }
    return current;
};

// CSS styles as constants to avoid recreation
const styles = {
    container: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    } as React.CSSProperties,
    
    sectionHeader: {
        color: '#6b7280',
        fontSize: '14px',
        fontWeight: '500',
        margin: '0 0 8px 0',
    } as React.CSSProperties,
    
    input: {
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    } as React.CSSProperties,
    
    inputFocused: {
        outline: 'none',
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    } as React.CSSProperties,
    
    inputDisabled: {
        backgroundColor: '#f9fafb',
        color: '#6b7280',
        cursor: 'not-allowed',
    } as React.CSSProperties,
    
    textarea: {
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '14px',
        resize: 'vertical' as const,
        minHeight: '80px',
        fontFamily: 'inherit',
    } as React.CSSProperties,
    
    button: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 16px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        backgroundColor: '#ffffff',
        color: '#374151',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        gap: '6px',
    } as React.CSSProperties,
    
    buttonHover: {
        backgroundColor: '#f9fafb',
        borderColor: '#9ca3af',
    } as React.CSSProperties,
    
    buttonRemove: {
        padding: '4px',
        borderColor: '#fca5a5',
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        minWidth: '32px',
        height: '32px',
        marginRight: '8px',
    } as React.CSSProperties,
    
    objectContainer: {
        display: 'flex',
        alignItems: 'flex-start',
    } as React.CSSProperties,
    
    objectLine: {
        width: '1px',
        backgroundColor: '#e5e7eb',
        minHeight: '100%',
        marginRight: '16px',
        flexShrink: 0,
    } as React.CSSProperties,
    
    objectContent: {
        flex: 1,
        paddingLeft: '16px',
    } as React.CSSProperties,
    
    arrayItem: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '12px',
    } as React.CSSProperties,
    
    listItem: {
        listStyle: 'none',
        margin: '0 0 12px 0',
        padding: '0',
    } as React.CSSProperties,
    
    list: {
        listStyle: 'none',
        margin: '0',
        padding: '0',
    } as React.CSSProperties,
};

// SVG Icons as components to avoid dependencies
const PlusIcon = memo(() => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
));

const XCircleIcon = memo(() => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="m15 9-6 6"/>
        <path d="m9 9 6 6"/>
    </svg>
));

// Memoized input components for better performance
const StringInput = memo(({ 
    path, 
    item, 
    data, 
    onInputChange 
}: {
    path: string[];
    item: IJSONEditorSchemaItem;
    data: any;
    onInputChange: (path: string[], value: string | number) => void;
}) => {
    const value = getValue(data, path);
    const displayValue = useMemo(() => {
        if (value === null || value === undefined) {
            return (item.value as string) || '';
        }
        if (typeof value === 'object') {
            return Object.keys(value).length === 0 ? '' : JSON.stringify(value);
        }
        return value.toString();
    }, [value, item.value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange(path, e.target.value);
    }, [path, onInputChange]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        Object.assign(e.target.style, styles.inputFocused);
    }, []);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = '#d1d5db';
        e.target.style.boxShadow = 'none';
    }, []);

    return (
        <input
            type="text"
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={!item.mutateable}
            style={{
                ...styles.input,
                ...(item.mutateable ? {} : styles.inputDisabled)
            }}
            {...(item.InputProps || {})}
        />
    );
});

const SelectInput = memo(({ 
    path, 
    item, 
    data, 
    onInputChange 
}: {
    path: string[];
    item: IJSONEditorSchemaItem;
    data: any;
    onInputChange: (path: string[], value: string | number) => void;
}) => {
    const value = getValue(data, path);
    const currentValue = useMemo(() => {
        return (value !== null && value !== undefined) ? value : item.value;
    }, [value, item.value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        // Try to parse as number if the option value is numeric
        const option = item.options?.find(opt => opt.value.toString() === newValue);
        onInputChange(path, option ? option.value : newValue);
    }, [path, onInputChange, item.options]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLSelectElement>) => {
        Object.assign(e.target.style, styles.inputFocused);
    }, []);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLSelectElement>) => {
        e.target.style.borderColor = '#d1d5db';
        e.target.style.boxShadow = 'none';
    }, []);

    if (!item.options || item.options.length === 0) {
        return (
            <div style={{ color: '#ef4444', padding: '8px', fontSize: '14px' }}>
                Error: Select field requires options array
            </div>
        );
    }

    return (
        <select
            value={currentValue?.toString() || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={!item.mutateable}
            style={{
                ...styles.input,
                ...(item.mutateable ? {} : styles.inputDisabled),
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'><path fill=\'%23666\' d=\'M6 8L2 4h8z\'/></svg>")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px'
            }}
            {...(item.InputProps || {})}
        >
            {!currentValue && (
                <option value="" disabled>
                    Select an option...
                </option>
            )}
            {item.options.map((option, index) => (
                <option key={index} value={option.value.toString()}>
                    {option.label}
                </option>
            ))}
        </select>
    );
});

const BooleanInput = memo(({ 
    path, 
    item, 
    data, 
    onInputChange 
}: {
    path: string[];
    item: IJSONEditorSchemaItem;
    data: any;
    onInputChange: (path: string[], value: string | number) => void;
}) => {
    const value = getValue(data, path);
    const currentValue = useMemo(() => {
        return (value !== null && value !== undefined) ? Boolean(value) : Boolean(item.value);
    }, [value, item.value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange(path, e.target.checked);
    }, [path, onInputChange]);

    return (
        <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: item.mutateable ? 'pointer' : 'not-allowed',
            color: item.mutateable ? '#374151' : '#6b7280'
        }}>
            <input
                type="checkbox"
                checked={currentValue}
                onChange={handleChange}
                disabled={!item.mutateable}
                style={{
                    width: '16px',
                    height: '16px',
                    cursor: item.mutateable ? 'pointer' : 'not-allowed'
                }}
                {...(item.InputProps || {})}
            />
            <span style={{ fontSize: '14px' }}>
                {item.name || path[path.length - 1] || 'Boolean value'}
            </span>
        </label>
    );
});

const NumberInput = memo(({ 
    path, 
    item, 
    data, 
    onInputChange 
}: {
    path: string[];
    item: IJSONEditorSchemaItem;
    data: any;
    onInputChange: (path: string[], value: string | number) => void;
}) => {
    const value = getValue(data, path);
    const displayValue = useMemo(() => {
        return (value !== null && value !== undefined) ? value : (item.value as number) || 0;
    }, [value, item.value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const numValue = parseFloat(e.target.value);
        onInputChange(path, isNaN(numValue) ? 0 : numValue);
    }, [path, onInputChange]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        Object.assign(e.target.style, styles.inputFocused);
    }, []);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = '#d1d5db';
        e.target.style.boxShadow = 'none';
    }, []);

    return (
        <input
            type="number"
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={!item.mutateable}
            style={{
                ...styles.input,
                ...(item.mutateable ? {} : styles.inputDisabled)
            }}
            {...(item.InputProps || {})}
        />
    );
});

const BigStringInput = memo(({ 
    path, 
    item, 
    data, 
    onInputChange 
}: {
    path: string[];
    item: IJSONEditorSchemaItem;
    data: any;
    onInputChange: (path: string[], value: string | number) => void;
}) => {
    const value = getValue(data, path);
    const displayValue = useMemo(() => {
        return (value !== null && value !== undefined) ? value.toString() : (item.value as string) || '';
    }, [value, item.value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onInputChange(path, e.target.value);
    }, [path, onInputChange]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
        Object.assign(e.target.style, styles.inputFocused);
    }, []);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
        e.target.style.borderColor = '#d1d5db';
        e.target.style.boxShadow = 'none';
    }, []);

    return (
        <textarea
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={!item.mutateable}
            style={{
                ...styles.textarea,
                ...(item.mutateable ? {} : styles.inputDisabled)
            }}
            placeholder={(item.value as string) || ''}
            {...(item.InputProps || {})}
        />
    );
});

// Main component
const JSONEditor: React.FC<JSONEditorProps> = ({ data, schema, onDataChange }) => {
    
    const handleInputChange = useCallback((path: string[], value: string | number) => {
        if (!Array.isArray(path) || path.length === 0) return;
        
        const updatedData = structuredClone ? structuredClone(data) : JSON.parse(JSON.stringify(data));
        let currentLevel = updatedData as any;
        
        // Navigate to the parent object
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
            if (currentLevel[key] === null || currentLevel[key] === undefined) {
                currentLevel[key] = {};
            }
            currentLevel = currentLevel[key];
        }
        
        // Set the final value
        currentLevel[path[path.length - 1]] = value;
        onDataChange(updatedData);
    }, [data, onDataChange]);

    const createNewItem = useCallback((schemaItem: any): any => {
        if (!schemaItem || typeof schemaItem !== 'object') return {};
        
        const newItem: any = {};
        
        Object.entries(schemaItem).forEach(([key, item]: [string, any]) => {
            if (!item || typeof item !== 'object') return;
            
            switch (item.type) {
                case "object":
                    newItem[key] = createNewItem(item.value);
                    break;
                case "array":
                    newItem[key] = [];
                    break;
                case "string":
                case "big-string":
                    newItem[key] = (item.value as string) || '';
                    break;
                case "number":
                    newItem[key] = (item.value as number) || 0;
                    break;
                case "select":
                    newItem[key] = item.value || (item.options?.[0]?.value) || '';
                    break;
                case "boolean":
                    newItem[key] = Boolean(item.value);
                    break;
                default:
                    newItem[key] = null;
                    break;
            }
        });
        
        return newItem;
    }, []);

    const handleArrayItemAddition = useCallback((path: string[]) => {
        if (!Array.isArray(path) || path.length === 0) return;
        
        const updatedData = structuredClone ? structuredClone(data) : JSON.parse(JSON.stringify(data));
        let currentLevel = updatedData as any;

        // Navigate to the array
        for (const key of path) {
            if (currentLevel[key] === null || currentLevel[key] === undefined) {
                currentLevel[key] = [];
            }
            currentLevel = currentLevel[key];
        }

        // Add new item to array
        if (Array.isArray(currentLevel)) {
            // Find the schema for this array to create a proper new item
            let schemaItem = schema.value as any;
            for (const key of path) {
                schemaItem = schemaItem?.[key];
            }
            
            const newItem = schemaItem?.value ? createNewItem(schemaItem.value) : {};
            currentLevel.push(newItem);
        }

        onDataChange(updatedData);
    }, [data, onDataChange, schema, createNewItem]);

    const handleArrayItemRemoval = useCallback((path: string[], index: number) => {
        if (!Array.isArray(path) || path.length === 0 || index < 0) return;
        
        const updatedData = structuredClone ? structuredClone(data) : JSON.parse(JSON.stringify(data));
        let currentLevel = updatedData as any;

        // Navigate to the array
        for (const key of path) {
            currentLevel = currentLevel?.[key];
        }

        // Remove item from array
        if (Array.isArray(currentLevel) && index < currentLevel.length) {
            currentLevel.splice(index, 1);
            onDataChange(updatedData);
        }
    }, [data, onDataChange]);

    const ItemRenderer = memo(({ 
        keys, 
        item 
    }: { 
        keys: string[]; 
        item: IJSONEditorSchemaItem 
    }) => {
        const keyString = keys.join('.');
        
        switch (item.type) {
            case "string":
                return (
                    <li key={keyString} style={styles.listItem}>
                        <StringInput
                            path={keys}
                            item={item}
                            data={data}
                            onInputChange={handleInputChange}
                        />
                    </li>
                );

            case "big-string":
                return (
                    <li key={keyString} style={styles.listItem}>
                        <BigStringInput
                            path={keys}
                            item={item}
                            data={data}
                            onInputChange={handleInputChange}
                        />
                    </li>
                );

            case "number":
                return (
                    <li key={keyString} style={styles.listItem}>
                        <NumberInput
                            path={keys}
                            item={item}
                            data={data}
                            onInputChange={handleInputChange}
                        />
                    </li>
                );

            case "select":
                return (
                    <li key={keyString} style={styles.listItem}>
                        <SelectInput
                            path={keys}
                            item={item}
                            data={data}
                            onInputChange={handleInputChange}
                        />
                    </li>
                );

            case "boolean":
                return (
                    <li key={keyString} style={styles.listItem}>
                        <BooleanInput
                            path={keys}
                            item={item}
                            data={data}
                            onInputChange={handleInputChange}
                        />
                    </li>
                );

            case "object":
                return (
                    <div key={keyString} style={styles.objectContainer}>
                        <div style={styles.objectLine} />
                        <div style={styles.objectContent}>
                            <h4 style={styles.sectionHeader}>{keys[keys.length - 1] || 'Object'}</h4>
                            <ul style={styles.list}>
                                {Object.entries(item.value as IJSONEditorSchema).map(([name, nestedItem]) => (
                                    <ItemRenderer
                                        key={`${keyString}.${name}`}
                                        keys={[...keys, name]}
                                        item={nestedItem}
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                );

            case "array":
                const arrayData = getValue(data, keys);
                const arrayLength = Array.isArray(arrayData) ? arrayData.length : 0;
                
                return (
                    <div key={keyString}>
                        <h4 style={styles.sectionHeader}>{keys[keys.length - 1] || 'Array'}</h4>
                        <ul style={styles.list}>
                            {arrayLength > 0 && Array.from({ length: arrayLength }).map((_, index) => (
                                <li key={`${keyString}[${index}]`} style={styles.arrayItem}>
                                    <button
                                        onClick={() => handleArrayItemRemoval(keys, index)}
                                        style={styles.buttonRemove}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#fee2e2';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#fef2f2';
                                        }}
                                        title="Remove item"
                                    >
                                        <XCircleIcon />
                                    </button>
                                    <div style={{ flex: 1 }}>
                                        <ItemRenderer
                                            keys={[...keys, index.toString()]}
                                            item={item.value as IJSONEditorSchemaItem}
                                        />
                                    </div>
                                </li>
                            ))}
                            {item.mutateable && (
                                <li style={styles.listItem}>
                                    <button
                                        onClick={() => handleArrayItemAddition(keys)}
                                        style={styles.button}
                                        onMouseEnter={(e) => {
                                            Object.assign(e.currentTarget.style, styles.buttonHover);
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#ffffff';
                                            e.currentTarget.style.borderColor = '#d1d5db';
                                        }}
                                    >
                                        <PlusIcon />
                                        Add new element to {item.name || keys[keys.length - 1] || 'array'}
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                );

            default:
                return (
                    <div key={keyString} style={{ color: '#ef4444', padding: '8px' }}>
                        Unknown type: {item.type} for {keys[keys.length - 1]}
                    </div>
                );
        }
    });

    return (
        <div style={styles.container}>
            <h4 style={styles.sectionHeader}>Root</h4>
            <ul style={styles.list}>
                {Object.entries(schema.value as IJSONEditorSchema).map(([name, item]) => (
                    <ItemRenderer key={name} keys={[name]} item={item} />
                ))}
            </ul>
        </div>
    );
};

export default memo(JSONEditor);
