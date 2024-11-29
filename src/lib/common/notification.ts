import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import default styles

let notyf: Notyf | null = null;

if (typeof window !== 'undefined') {
  notyf = new Notyf({
    duration: 4000, // The duration of each notification in milliseconds
    position: {
      x: 'right',
      y: 'top',
    },
    types: [
      {
        type: 'success',
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
        icon: {
          className: 'material-icons',
          tagName: 'i',
         
        },
      },
      {
        type: 'error',
        background: 'linear-gradient(to right, #e74c3c, #e67e22)',
        icon: {
          className: 'material-icons',
          tagName: 'i',
         
        },
      },
    ],
  });
}

export function showNotification(
  title: string,
  message: string,
  type: 'success' | 'error' = 'success'
) {
  if (notyf) {
    const fullMessage = `${title}: ${message}`;
    if (type === 'success') {
      notyf.success(fullMessage);
    } else {
      notyf.error(fullMessage);
    }
  }
}
