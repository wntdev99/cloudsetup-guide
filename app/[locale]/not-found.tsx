import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container py-20 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="text-8xl font-bold mb-4 text-muted-foreground">404</div>
        <h1 className="text-4xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
        <p className="text-lg text-muted-foreground mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
          <br />
          주소를 확인하시거나 홈페이지로 돌아가주세요.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/ko">
            <Button size="lg">홈으로 돌아가기</Button>
          </Link>
          <Link href="/ko/platforms/gcp">
            <Button size="lg" variant="outline">
              가이드 둘러보기
            </Button>
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-sm font-semibold mb-4 text-muted-foreground">
            인기 가이드
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/ko/platforms/gcp">
              <Button variant="ghost" size="sm">
                GCP 가이드
              </Button>
            </Link>
            <Link href="/ko/platforms/aws">
              <Button variant="ghost" size="sm">
                AWS 가이드
              </Button>
            </Link>
            <Link href="/ko/platforms/supabase">
              <Button variant="ghost" size="sm">
                Supabase 가이드
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
