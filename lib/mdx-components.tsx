import type { MDXComponents } from 'mdx/types';
import { Step } from '@/components/guide/Step';
import { Screenshot } from '@/components/guide/Screenshot';
import { CopyBlock } from '@/components/guide/CopyBlock';
import { Callout } from '@/components/guide/Callout';
import { FreeTierInfo } from '@/components/guide/FreeTierInfo';
import { DevTip } from '@/components/guide/DevTip';
import { Checkpoint } from '@/components/guide/Checkpoint';
import { PrerequisiteCheck } from '@/components/guide/PrerequisiteCheck';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Step,
    Screenshot,
    CopyBlock,
    Callout,
    FreeTierInfo,
    DevTip,
    Checkpoint,
    PrerequisiteCheck,
    ...components,
  };
}
