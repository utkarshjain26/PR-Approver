import { formatDistanceToNowStrict } from 'date-fns';


export function TimeAgo( timestamp ) {
    // Format the timestamp into a "time ago" format
    const timeAgo = formatDistanceToNowStrict(new Date(timestamp), { addSuffix: false });

    // Convert the format to a short version
    const shortFormat = timeAgo
      .replace(' seconds', 's')
      .replace(' second', 's')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' days', 'd')
      .replace(' day', 'd');

    return shortFormat;
}
