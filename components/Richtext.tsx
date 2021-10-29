import React from "react";
import MUIRichTextEditor from "mui-rte";
import { convertToRaw } from "draft-js";
import { makeStyles } from "@mui/styles";
import Box from "@mui/system/Box";

interface RichtextProps {
  value: string;
  setValue: (val: string) => void;
};

const useStyles = makeStyles({
  richText: {
    border: "1px solid #1A202C",
    minHeight: "140px",
    borderRadius: "6px",
    padding: "4px",
    paddingLeft: "10px",
    marginTop: "10px",
  },
});  

const Richtext: React.FC<RichtextProps> = ({
  value,
  setValue,
}) => {
  const {
    richText,
  } = useStyles();
  const save = (data: string) => {
    console.log(data);
  };
  
  return (
    <Box className={richText}>
      <MUIRichTextEditor
        label="Instructions..."
        controls={[
          "title",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "highlight",
          "link",
          "numberList",
          "bulletList",
          "quote",
          "code",
          "clear",
        ]}
        defaultValue={value}
        onChange={(state) => {
          if (!state.getCurrentContent().hasText()) {
            setValue("");
          } else {
            setValue(JSON.stringify(convertToRaw(state.getCurrentContent())));
          }
        }}
      />
    </Box>
  );
};

export default Richtext;
