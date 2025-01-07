"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Layout,
  Responsive,
  ResponsiveProps,
  WidthProvider,
} from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

export type InteractiveResponsiveGridBreakpoints = {
  [width: string]: number;
};

export const defaultBreakpoints: InteractiveResponsiveGridBreakpoints = {
  5000: 11,
  4000: 10,
  3500: 9,
  2500: 8,
  2000: 7,
  1200: 6,
  1000: 5,
  900: 4,
  400: 3,
  200: 2,
  0: 2,
};

const responsiveLayoutFromBreakpoints = (
  breakpoints: InteractiveResponsiveGridBreakpoints,
  margin: number,
  layout: Layout[]
): ResponsiveProps => {
  const entries = Object.entries(breakpoints);

  const bps: ResponsiveProps["breakpoints"] = {};
  const cols: ResponsiveProps["cols"] = {};
  const layouts: ResponsiveProps["layouts"] = {};
  const mg: ResponsiveProps["margin"] = {};

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    bps[key] = Number(key);
    cols[key] = value;
    layouts[key] = layout;
    mg[key] = [margin, margin];
  }

  return {
    breakpoints: bps,
    cols,
    layouts,
    margin: mg,
  };
};

export type GridItem = {
  key: string;
  width: number;
  height: number;
};

export interface InteractiveResponsiveGridProps<T extends GridItem> {
  className?: string;

  gridConfig?: ResponsiveProps;
  selectable?: boolean;

  items: T[];
  selectedItems?: T[];
  breakpoints?: InteractiveResponsiveGridBreakpoints;
  numColumns?: number;
  margin?: number;

  renderItem: (item: T, index: number, selected: boolean) => ReactNode;

  onItemsReordered?: (items: T[]) => Promise<void> | void;
  onItemsSelected?: (items: T[]) => Promise<void> | void;
  onItemClicked?: (item: T) => Promise<void> | void;
}

export default function InteractiveResponsiveGrid<T extends GridItem>({
  className,
  gridConfig,
  selectable,
  items: initialItems,
  selectedItems: initialSelectedItems,
  breakpoints = defaultBreakpoints,
  numColumns: fixedNumCols,
  margin = 0,
  renderItem,
  onItemsReordered,
  onItemsSelected,
  onItemClicked,
}: InteractiveResponsiveGridProps<T>) {
  const [items, setItems] = useState(initialItems);
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const [selectedItems, setSelectedItems] = useState<T[]>(
    initialSelectedItems ?? []
  );

  useEffect(() => {
    onItemsSelected?.(selectedItems);
  }, [selectedItems, onItemsSelected]);

  const [layoutConfig, setLayoutConfig] = useState<Layout[]>([]);

  // Update the layout config when the items themselves change
  useEffect(() => {
    setLayoutConfig(
      items.map((item) => {
        const cell = {
          i: item.key,
          x: 0,
          y: 0,
          w: item.width > item.height ? 2 : 1,
          h: 2,
        };

        return cell;
      })
    );
  }, [items]);

  // Update the new order of items when they're dragged in the grid
  useEffect(() => {
    const orderedIds = layoutConfig.sort((a, b) => {
      if (a.y === b.y) {
        return b.x - a.x;
      }

      return b.y - a.y;
    });

    onItemsReordered?.(
      orderedIds.map((id) => items.find((item) => item.key === id.i)!)
    );
  }, [layoutConfig, items, onItemsReordered]);

  const [numCols, setNumCols] = useState(fixedNumCols ?? 0);
  const [width, setWidth] = useState(0);
  const rowHeight = useMemo(() => {
    const cellWidth = width / numCols;
    const cellHeight = (cellWidth * 2) / 3;
    return cellHeight;
  }, [numCols, width]);

  const responsiveLayout: ResponsiveProps = useMemo(() => {
    return {
      ...responsiveLayoutFromBreakpoints(breakpoints, margin, layoutConfig),
      ...gridConfig,
    };
  }, [breakpoints, gridConfig, layoutConfig, margin]);

  const onWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (!!fixedNumCols) return;

    let bpIndex =
      Object.keys(breakpoints).findIndex((bp) => newWidth < Number(bp)) - 1;

    if (bpIndex < 0) {
      bpIndex = Object.keys(breakpoints).length - 1;
    }

    const newNumCols = Object.values(breakpoints)[bpIndex];
    setNumCols(newNumCols);
  };

  return (
    <div className={className}>
      <ResponsiveGridLayout
        compactType="horizontal"
        isResizable={false}
        isBounded={true}
        onDragStop={setLayoutConfig}
        isDraggable={false}
        rowHeight={rowHeight}
        {...responsiveLayout}
        onWidthChange={onWidthChange}
      >
        {items.map((item, index) => (
          <div
            key={item.key}
            onClick={() => {
              onItemClicked?.(item);
              if (!selectable) return;
              setSelectedItems((prev) =>
                prev.includes(item)
                  ? prev.filter((i) => i !== item)
                  : [...prev, item]
              );
            }}
          >
            {renderItem(
              item,
              index,
              selectedItems.find((i) => i.key === item.key) !== undefined
            )}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
