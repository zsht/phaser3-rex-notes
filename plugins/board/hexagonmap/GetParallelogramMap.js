import {
    xyz2q,
    xyz2r
} from 'rexPlugins/utils/grid/hexagon/CubeTransfer.js';

var GetParallelogramMap = function (grid, type, width, height, out) {
    if (out === undefined) {
        out = [];
    }
    var mode = grid.mode;
    switch (type) {
        case 0:
            for (var q = 0; q <= width; q++) {
                for (var r = 0; r <= height; r++) {
                    out.push({
                        x: xyz2q(mode, q, r, -q - r),
                        y: xyz2r(mode, q, r, -q - r)
                    });
                }
            }
            break;
        case 1:
            for (var s = 0; s <= width; s++) {
                for (var q = 0; q <= height; q++) {
                    out.push({
                        x: xyz2q(mode, q, -q - s, s),
                        y: xyz2r(mode, q, -q - s, s)
                    });
                }
            }
            break;
        case 2:
            for (var r = 0; r <= width; r++) {
                for (var s = 0; s <= height; s++) {
                    out.push({
                        x: xyz2q(mode, -r - s, r, s),
                        y: xyz2r(mode, -r - s, r, s)
                    });
                }
            }
            break;
    }

    return out;
}
export default GetParallelogramMap;