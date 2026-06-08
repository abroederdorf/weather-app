import styles from './SavedLocations.module.css';

export interface LocationTab {
  id: string;
  name: string;
  isGeo?: boolean;
}

interface Props {
  tabs: LocationTab[];
  activeId: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onAddClick: () => void;
}

export function SavedLocations({ tabs, activeId, onSelect, onRemove, onAddClick }: Props) {
  return (
    <div className={styles.bar}>
      <div className={`scroll-x ${styles.tabs}`}>
        {tabs.map((tab) => (
          <div key={tab.id} className={styles.tabWrap}>
            <button
              className={`${styles.tab} ${tab.id === activeId ? styles.active : ''}`}
              onClick={() => onSelect(tab.id)}
            >
              {tab.isGeo && <span className={styles.geoIcon}>◎ </span>}
              {tab.name}
            </button>
            {!tab.isGeo && (
              <button
                className={styles.removeBtn}
                onClick={(e) => { e.stopPropagation(); onRemove(tab.id); }}
                title="Remove location"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      <button className={styles.addBtn} onClick={onAddClick} title="Add location">
        +
      </button>
    </div>
  );
}
