import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GuideNotFound() {
  return (
    <div className="container py-20 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="text-6xl mb-6">📚</div>
        <h1 className="text-4xl font-bold mb-4">가이드를 찾을 수 없습니다</h1>
        <p className="text-lg text-muted-foreground mb-8">
          요청하신 가이드가 존재하지 않거나 아직 작성되지 않았습니다.
          <br />
          다른 가이드를 둘러보시거나 홈페이지로 돌아가주세요.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/ko">
            <Button size="lg">홈으로 돌아가기</Button>
          </Link>
          <Link href="/ko/platforms/gcp">
            <Button size="lg" variant="outline">
              GCP 가이드 보기
            </Button>
          </Link>
        </div>

        {/* Help text */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            찾으시는 가이드가 있으신가요?
            <br />
            <a
              href="https://github.com/your-repo/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub Issues
            </a>
            에서 가이드 요청을 남겨주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
