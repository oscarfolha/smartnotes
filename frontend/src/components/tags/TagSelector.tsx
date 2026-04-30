import { useState } from 'react';
import { useTags, useCreateTag } from '../../hooks/useTags';
import { useAppPreferences } from '../../contexts/appPreferences';
import './TagSelector.css';

interface TagSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function TagSelector({ selectedIds, onChange }: TagSelectorProps) {
  const { data: tags = [] } = useTags();
  const createTag = useCreateTag();
  const { t } = useAppPreferences();
  const [newTag, setNewTag] = useState('');

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  async function handleCreate() {
    const name = newTag.trim();
    if (!name) return;
    const tag = await createTag.mutateAsync(name);
    onChange([...selectedIds, tag.id]);
    setNewTag('');
  }

  return (
    <div className="tag-selector">
      <label className="tag-selector-label" htmlFor="tag-selector-input">{t('tags')}</label>
      <div className="tag-selector-list">
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            className={`tag-selector-chip ${selectedIds.includes(tag.id) ? 'active' : ''}`}
          >
            #{tag.name}
          </button>
        ))}
      </div>
      <div className="tag-selector-create">
        <input
          id="tag-selector-input"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreate())}
          placeholder={t('newTagPlaceholder')}
          className="tag-selector-input"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={!newTag.trim()}
          className="tag-selector-add"
        >
          {t('add')}
        </button>
      </div>
    </div>
  );
}
