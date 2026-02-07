import Image from 'next/image';

interface Highlight {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ScreenshotProps {
  src: string;
  alt: string;
  highlight?: Highlight;
  caption?: string;
  priority?: boolean;
}

export function Screenshot({ src, alt, highlight, caption, priority = false }: ScreenshotProps) {
  return (
    <figure className="my-6">
      <div className="relative border rounded-lg overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="w-full h-auto"
          priority={priority}
        />
        {highlight && (
          <div
            className="absolute border-4 border-red-500 pointer-events-none"
            style={{
              left: `${highlight.x}%`,
              top: `${highlight.y}%`,
              width: `${highlight.width}%`,
              height: `${highlight.height}%`,
            }}
          />
        )}
      </div>
      {caption && <figcaption className="mt-2 text-sm text-center text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
