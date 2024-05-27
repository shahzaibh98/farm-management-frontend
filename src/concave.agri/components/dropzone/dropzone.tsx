import { Box, Center, Grid } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState, useEffect, ChangeEvent } from 'react';

function FileDropzone({ imageURL }: { imageURL: string }) {
  const [selectedImage, setSelectedImage] = useState<string | File>(imageURL);

  useEffect(() => {
    setSelectedImage(imageURL);
  }, [imageURL]);

  const handleRemoveImage = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    setSelectedImage('');
    event.preventDefault();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImage(files[0]);
    } else {
      setSelectedImage('');
    }
  };

  // Generate the image source based on the type of selectedImage
  const imageSrc =
    selectedImage instanceof File
      ? URL.createObjectURL(selectedImage)
      : selectedImage;

  return (
    <Grid.Col span={{ base: 12 }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="image-upload"
      />

      <label htmlFor="image-upload">
        <Box
          style={{
            border: '2px dashed #ccc',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: imageSrc ? 'transparent' : '#f9f9f9',
            position: 'relative',
            height: '300px',
          }}
        >
          {imageSrc ? (
            <Box style={{ position: 'relative', height: '100%' }}>
              <img
                src={imageSrc}
                alt="Selected"
                style={{
                  objectFit: 'cover',
                  display: 'block',
                  width: '100%',
                  height: '100%',
                }}
              />
              <IconTrash
                size={24}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 1,
                  cursor: 'pointer',
                }}
                color="#ffbaba"
                onClick={handleRemoveImage}
              />
            </Box>
          ) : (
            <Center style={{ height: '100%' }}>
              <Box>
                <p>Drag and drop an image here, or click to select one</p>
              </Box>
            </Center>
          )}
        </Box>
      </label>
    </Grid.Col>
  );
}

export default FileDropzone;
