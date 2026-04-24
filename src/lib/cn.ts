import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "body-10-regular", "body-10-medium", "body-10-semibold",
            "body-12-regular", "body-12-medium", "body-12-semibold",
            "body-14-regular", "body-14-medium", "body-14-semibold",
            "body-15-regular", "body-15-medium", "body-15-semibold",
            "body-16-regular", "body-16-medium", "body-16-semibold",
            "title-14-medium", "title-14-semibold", "title-14-bold",
            "title-16-medium", "title-16-semibold", "title-16-bold",
            "title-18-medium", "title-18-semibold", "title-18-bold",
            "title-20-medium", "title-20-semibold", "title-20-bold",
            "title-24-medium", "title-24-semibold", "title-24-bold",
            "title-32-medium", "title-32-semibold", "title-32-bold",
            "title-40-medium", "title-40-semibold", "title-40-bold",
          ],
        },
      ],
    },
  },
});

export function cn(...classes: (string | undefined | null | false)[]) {
  return twMerge(classes.filter(Boolean).join(" "));
}
