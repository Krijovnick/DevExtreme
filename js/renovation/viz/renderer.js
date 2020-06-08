
const buildSimpleLineSegment = (points) => {
  const ii = (points || []).length;
  if (ii) {
    let list = ['M', points[0], points[1]];
    for (let i = 2; i < ii; i += 2) {
      list = [...list, 'L', points[i], points[i + 1]];
    }
    return list;
  }
  return ['M', 0, 0];
};

const buildSegments = (points, buildSimpleSegment) => {
  let segments = [];
  if (points[0] && points[0].length) {
    segments = points.reduce((list, point) => [...list, ...buildSimpleSegment(point)], []);
  } else {
    segments = buildSimpleSegment(points);
  }

  return segments.join(' ');
};

// eslint-disable-next-line import/prefer-default-export
export const buildLinePathFromPoints = (points) => buildSegments(points, buildSimpleLineSegment);
