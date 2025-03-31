import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sender, Bubble } from "@ant-design/x";
import { PlaceholderNode } from "../../constant";
import { useStyle } from "../../style";
import {
  MenuPage,
  useFunctionMenuStore,
} from "../../stores/functionMenu.store";
import { useConversationContext } from "../../stores/conversation.store";

interface ChatLandingViewProps {
  onNavigation?: () => void;
}

const ChatLandingView: React.FC<ChatLandingViewProps> = ({ onNavigation }) => {
  const { styles } = useStyle();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<string>("");
  const { createConversation } = useConversationContext();
  const { updateInputtingContent } = useFunctionMenuStore();

  const handlePromptClick = (info: { data: { description: string } }) => {
    setInputValue(info.data.description);
  };

  const handleCreateConversation = (content: string) => {
    if (!content.trim()) return;

    try {
      const newConversation = createConversation(MenuPage.Chat, []);
      if (onNavigation) {
        onNavigation();
      }
      updateInputtingContent(content);

      console.log("从落地页导航到新会话:", newConversation.id);
      navigate(`/chat/${newConversation.id}`);
    } catch (error) {
      console.error("创建会话错误:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "calc(100% - 12px)",
      }}
    >
      {/* 中间占位区域 - 可以放置欢迎信息、功能介绍等 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "50px",
        }}
      >
        <Bubble.List
          items={[
            {
              content: (
                <PlaceholderNode
                  className={styles.placeholder}
                  onPromptsItemClick={handlePromptClick}
                />
              ),
              variant: "borderless",
            },
          ]}
          className={styles.messages}
        />
      </div>

      {/* 底部发送区域 */}
      <div
        style={{
          position: "fixed",
          bottom: "80px",
          left: "324px",
          width: "calc(100% - 360px)",
        }}
      >
        <Sender
          value={inputValue}
          onChange={(value: string) => setInputValue(value)}
          onSubmit={handleCreateConversation}
          allowSpeech
          placeholder="您可以问我任何问题..."
        />
      </div>
    </div>
  );
};

export default ChatLandingView;
