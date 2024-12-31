"use client";

import { useCallback, useEffect, useState } from "react";
import { Tables } from "../../supabase/database.types";
import { NavButton } from "./NavButton";
import {
  Layout,
  Responsive,
  ResponsiveProps,
  WidthProvider,
} from "react-grid-layout";
import { LightboxImage } from "./LightboxImage";
import Checkbox from "./Checkbox";
import { defaultBreakpoints, GalleryBreakpoints } from "./Gallery";
import { formatPath } from "@/lib/util";

interface InteractiveDatabaseGalleryProps {
  photos: Tables<"photos">[];
  onReorder: (photos: Tables<"photos">[]) => Promise<void>;
  onRemove: (photos: Tables<"photos">[]) => Promise<void>;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const responsiveLayoutFromBreakpoints = (
  bp: GalleryBreakpoints,
  layout: Layout[]
): ResponsiveProps => {
  const entries = Object.entries(bp);

  const breakpoints: ResponsiveProps["breakpoints"] = {};
  const cols: ResponsiveProps["cols"] = {};
  const layouts: ResponsiveProps["layouts"] = {};
  const margin: ResponsiveProps["margin"] = {};

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    breakpoints[key] = Number(key);
    cols[key] = value;
    layouts[key] = layout;
    margin[key] = [0, 0];
  }

  return {
    breakpoints,
    cols,
    layouts,
    margin,
  };
};

export function InteractiveDatabaseGallery({
  photos,
  onRemove,
  onReorder,
}: InteractiveDatabaseGalleryProps) {
  const [canReorder, setCanReorder] = useState(false);
  const [orderedPhotos, setOrderedPhotos] = useState<Tables<"photos">[]>([]);
  const [removedPhotos, setRemovedPhotos] = useState<Tables<"photos">[]>([]);
  const [layoutConfig, setLayoutConfig] = useState<Layout[]>([]);
  const [currentNumCols, setCurrentNumCols] = useState(1);
  const [rowHeight, setRowHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const [pagePhotos, setPagePhotos] = useState<Tables<"photos">[]>(photos);

  const shuffle = useCallback(() => {
    setPagePhotos((prev) => [...prev].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    setPagePhotos(photos);
  }, [photos]);

  useEffect(() => {
    setLayoutConfig(
      pagePhotos.map((photo) => {
        const cell = {
          i: photo.drive_id,
          x: 0,
          y: 0,
          w: photo.width > photo.height ? 2 : 1,
          h: 2,
        };

        return cell;
      })
    );
  }, [pagePhotos]);

  useEffect(() => {
    const orderedIds = layoutConfig.sort((a, b) => {
      if (a.y === b.y) {
        return b.x - a.x;
      }

      return b.y - a.y;
    });

    setOrderedPhotos(
      orderedIds.map(
        (id) => pagePhotos.find((photo) => photo.drive_id === id.i)!
      )
    );
  }, [layoutConfig, pagePhotos]);

  useEffect(() => {
    // We want a 3:2 aspect ratio
    const cellWidth = width / currentNumCols;
    const cellHeight = (cellWidth * 2) / 3;
    setRowHeight(cellHeight);
  }, [currentNumCols, width]);

  return (
    <div className="w-full">
      <div className="w-2/3 flex flex-row gap-4 justify-center justify-self-center my-4">
        <NavButton
          onClick={() => onReorder(orderedPhotos)}
          text="Save Order"
          className="flex-1"
        />
        <NavButton
          onClick={() => onRemove(removedPhotos)}
          text="Remove Selected"
          className="flex-1"
        />
        <Checkbox
          label="Enable Reorder"
          checked={canReorder}
          onClick={() => setCanReorder(!canReorder)}
        />
        <NavButton
          onClick={() => shuffle()}
          text="Shuffle"
          className="flex-1"
        />
      </div>
      <ResponsiveGridLayout
        {...responsiveLayoutFromBreakpoints(defaultBreakpoints, layoutConfig)}
        onWidthChange={setWidth}
        onBreakpointChange={(bp) => {
          setCurrentNumCols(defaultBreakpoints[bp]);
        }}
        isResizable={false}
        compactType="horizontal"
        isBounded={true}
        onDragStop={setLayoutConfig}
        isDraggable={canReorder}
        rowHeight={rowHeight}
      >
        {pagePhotos.map((photo) => (
          <div key={photo.drive_id} className="p-1">
            <LightboxImage<"db">
              hoverText={formatPath(photo.path) + photo.position}
              grayed={removedPhotos.includes(photo)}
              size={220}
              photo={photo}
              onClick={() => {
                if (canReorder) return;
                setRemovedPhotos((prev) =>
                  prev.includes(photo)
                    ? prev.filter((p) => p !== photo)
                    : [...prev, photo]
                );
              }}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
