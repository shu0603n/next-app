import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface ErrorProps {
  statusCode?: number;
}

const Error = ({ statusCode }: ErrorProps) => {
  const router = useRouter();

  useEffect(() => {
    if (statusCode === 500) {
      router.replace('/500'); // 500エラー時の遷移先
    }
  }, [statusCode, router]);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>エラーが発生しました</h1>
      <p>現在問題を修正中です。</p>
    </div>
  );
};

// サーバーまたはクライアントのエラーステータスを取得
Error.getInitialProps = ({ res, err }: { res?: any; err?: any }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
