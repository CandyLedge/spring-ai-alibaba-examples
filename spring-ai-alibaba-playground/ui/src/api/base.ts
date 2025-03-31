import { BASE_URL } from "../constant";

const decoder = new TextDecoder("utf-8");

export interface Result<T> {
  code: number;
  data: T;
  message: string;
}

export interface ModelInfo {
  model: string;
  desc: string;
}

// 获取支持的模型列表
export const getModels = async (): Promise<Set<ModelInfo>> => {
  const res = await fetch(BASE_URL + "/dashscope/getModels", {
    method: "GET",
  });
  console.log("getModels res!!!", res);

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error("Failed to get response reader");
  }

  let buffer = "";
  await reader.read().then(function process({ done, value }) {
    if (done) return;
    buffer += decoder.decode(value);
    return reader.read().then(process);
  });

  console.log("getModels buffer!!!", buffer);

  const result: Result<Set<ModelInfo>> = JSON.parse(buffer);
  return result.data;
};

// 服务器是否还在运行
export const getIsHealth = async (): Promise<string> => {
  const controller = new AbortController();
  const time = setTimeout(() => controller.abort(), 3000);

  const res = await fetch(BASE_URL + "/health", {
    method: "GET",
    signal: controller.signal,
  });

  clearTimeout(time);
  const result: Result<string> = await res.json();
  return result.data;
};
