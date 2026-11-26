import Image from 'next/image';

export function TripMateMark({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex shrink-0" aria-hidden="true">
      <Image src="/tripmate/brand/symbol_light.png" alt="" width={size} height={size} className="dark:hidden" />
      <Image src="/tripmate/brand/symbol_dark.png" alt="" width={size} height={size} className="hidden dark:block" />
    </span>
  );
}
