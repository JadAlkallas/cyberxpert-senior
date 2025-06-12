
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  username: string;
  onUpload: (file: File) => Promise<string | null>;
  disabled?: boolean;
}

export const AvatarUpload = ({ currentAvatarUrl, username, onUpload, disabled }: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const uploadedUrl = await onUpload(file);
      if (uploadedUrl) {
        setPreviewUrl(null); // Clear preview since we now have the actual uploaded image
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const getDisplayUrl = () => {
    return previewUrl || currentAvatarUrl;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={getDisplayUrl()} alt={username} />
          <AvatarFallback className="text-lg">
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <Button 
        onClick={triggerFileSelect} 
        disabled={disabled || isUploading}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {isUploading ? 'Uploading...' : 'Upload Photo'}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <p className="text-xs text-gray-500 text-center">
        JPG, PNG or GIF. Max size 5MB.
      </p>
    </div>
  );
};
