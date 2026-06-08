import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SavedLocation } from '../../hooks/useSavedLocations';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherInfo } from '../../utils/weather';
import { formatTempShort } from '../../utils/units';
import styles from './LocationsPage.module.css';

const GEO_TAB_ID = '__geo__';

interface Props {
  locations: SavedLocation[];
  activeId: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onAddClick: () => void;
  onBack: () => void;
  geoAvailable: boolean;
  geoPermission: PermissionState | null;
  onRequestGeo: () => void;
  geoPosition: { latitude: number; longitude: number } | null;
}

export function LocationsPage({
  locations, activeId, onSelect, onRemove, onReorder, onAddClick, onBack,
  geoAvailable, geoPermission, onRequestGeo, geoPosition,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = locations.findIndex((l) => l.id === active.id);
    const newIndex = locations.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(locations, oldIndex, newIndex);
    onReorder(reordered.map((l) => l.id));
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
        <span className={styles.title}>Locations</span>
        <button className={styles.addBtn} onClick={onAddClick}>+</button>
      </header>

      <div className={styles.list}>
        {/* Pinned geo row */}
        <div
          className={`${styles.row} ${activeId === GEO_TAB_ID ? styles.active : ''}`}
          onClick={geoAvailable ? () => onSelect(GEO_TAB_ID) : undefined}
          style={{ cursor: geoAvailable ? 'pointer' : 'default' }}
        >
          <span className={styles.geoIcon}>◎</span>
          <div className={styles.info}>
            <span className={styles.name}>My Location</span>
            {geoAvailable ? (
              <span className={styles.sub}>GPS</span>
            ) : geoPermission === 'denied' ? (
              <span className={styles.sub}>Enable in browser settings</span>
            ) : (
              <button className={styles.retryBtn} onClick={(e) => { e.stopPropagation(); onRequestGeo(); }}>
                Use my location
              </button>
            )}
          </div>
          {activeId === GEO_TAB_ID && <span className={styles.check}>✓</span>}
          {geoPosition && (
            <RowWeather latitude={geoPosition.latitude} longitude={geoPosition.longitude} />
          )}
        </div>

        <div className={styles.divider} />

        {locations.length === 0 && (
          <div className={styles.empty}>No saved locations — tap + to add one</div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={locations.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            {locations.map((loc) => (
              <SortableRow
                key={loc.id}
                location={loc}
                isActive={activeId === loc.id}
                onSelect={onSelect}
                onRemove={onRemove}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function RowWeather({ latitude, longitude }: { latitude: number; longitude: number }) {
  const { data } = useWeather(latitude, longitude);
  if (!data) return <div className={styles.weatherSpacer} />;
  const icon = getWeatherInfo(data.daily.weathercode[0]).icon;
  return (
    <div className={styles.rowWeather}>
      <span className={styles.rowWeatherIcon}>{icon}</span>
      <span className={styles.rowHi}>{formatTempShort(data.daily.temperature_2m_max[0])}</span>
      <span className={styles.rowLo}>{formatTempShort(data.daily.temperature_2m_min[0])}</span>
    </div>
  );
}

function SortableRow({
  location, isActive, onSelect, onRemove,
}: {
  location: SavedLocation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: location.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sub = [location.region, location.country].filter(Boolean).join(', ');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.row} ${isActive ? styles.active : ''}`}
    >
      <button className={styles.dragHandle} {...attributes} {...listeners} tabIndex={-1}>
        ≡
      </button>
      <div className={styles.info} onClick={() => onSelect(location.id)}>
        <span className={styles.name}>{location.name}</span>
        {sub && <span className={styles.sub}>{sub}</span>}
      </div>
      {isActive && <span className={styles.check}>✓</span>}
      <RowWeather latitude={location.latitude} longitude={location.longitude} />
      <button
        className={styles.removeBtn}
        onClick={(e) => { e.stopPropagation(); onRemove(location.id); }}
        title="Remove"
      >
        ✕
      </button>
    </div>
  );
}
