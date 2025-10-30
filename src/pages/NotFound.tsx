import { HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* 404 Content */}
        <div className="mb-12">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist. You might have followed a broken link or entered an incorrect URL.
          </p>
        </div>

        {/* Home Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mx-auto text-muted-foreground hover:text-foreground transition-colors px-4 py-2 border border-border rounded-md hover:bg-accent"
        >
          <HomeIcon className="h-4 w-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;