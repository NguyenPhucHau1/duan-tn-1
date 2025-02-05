'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import Layout from '@/app/components/admin/Layout';
import styles from './ThemTinTuc.module.css'; // CSS file

const ThemTinTuc = () => {
  const [formData, setFormData] = useState({
    title: '',
    describe: '',
    content: '',
    loai: 'Tin tức', // Default value
    trangthai: 'Hiện' // Default value
  });
  const [image, setImage] = useState(null);
  const router = useRouter();
  const editorVnRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('describe', formData.describe);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('loai', formData.loai);
      formDataToSend.append('trangthai', formData.trangthai);
      formDataToSend.append('image', image);

      const response = await axios.post('http://localhost:3000/tintuc/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        router.push('/admin/tin-tuc');
      }
    } catch (error) {
      console.error('Error adding tin tuc:', error);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Thêm Tin Tức</h1>
        <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
          {/** Form Group for Title */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          {/** Form Group for Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Mô tả</label>
            <input
              type="text"
              name="describe"
              value={formData.describe}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          {/** Form Group for Content */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Nội dung</label>
            <Editor
              apiKey="sxuecqw6ie1p3ksawpdq4piz7jvlucsub11a6z83r8atnksh"
              onInit={(evt, editor) => { editorVnRef.current = editor; }}
              value={formData.content}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist outdent indent | removeformat | help'
              }}
              onEditorChange={handleEditorChange}
            />
          </div>

          {/** Form Group for Image Upload */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Hình ảnh</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              required
              className={styles.input}
            />
          </div>

          {/** Form Group for Type Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Loại</label>
            <select
              name="loai"
              value={formData.loai}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="Tin tức">Tin tức</option>
              <option value="Sự kiện">Sự kiện</option>
              <option value="Quà tặng">Quà tặng</option>
            </select>
          </div>

          {/** Form Group for Status Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Trạng thái</label>
            <select
              name="trangthai"
              value={formData.trangthai}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="Ẩn">Ẩn</option>
              <option value="Hiện">Hiện</option>
            </select>
          </div>

          {/** Submit Button */}
          <button type="submit" className={styles.submitButton}>Thêm</button>
        </form>
      </div>
    </Layout>
  );
};

export default ThemTinTuc;
