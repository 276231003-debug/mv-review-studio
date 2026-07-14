const state = {
  file: null,
  videoUrl: "",
  objectUrl: "",
  assetObjectUrls: {
    character: [],
    background: [],
    style: [],
    storyboard: []
  },
  duration: 0,
  report: null
};

const levelRank = {
  "不通过 X": 0,
  "通过 ✓": 1,
  "优秀 ★": 2,
  "N/A": -1
};

const completeVideoStandards = [
  {
    key: "clarity",
    layer: "完整视频评估",
    label: "清晰度",
    question: "画面是否清晰稳定，主体、面部、字幕和关键动作是否可辨认。",
    fail: "主体或面部经常糊化，压缩、噪点或抖动明显，影响观看与信息识别。",
    pass: "主体和关键动作基本清晰，少量压缩或轻微模糊不影响整体观看。",
    excellent: "全片清晰稳定，主体细节、字幕和关键动作都能被准确识别。"
  },
  {
    key: "continuity",
    layer: "完整视频评估",
    label: "跨分镜统一性",
    question: "不同分镜片段之间人物形象、背景风格、构图语言是否保持一致。",
    fail: "出现明显人物/风格/画面突变，或整体像多个不同视频拼接。",
    pass: "多数片段保持人物、风格、构图语言一致，少数瑕疵不影响整体观感。",
    excellent: "全片人物、风格、构图和景别意识高度统一，几乎没有割裂感。"
  },
  {
    key: "transition",
    layer: "完整视频评估",
    label: "画面拼接连贯度",
    question: "片段与片段之间的转场是否自然，是否存在硬切、上下文不关联或观感突兀。",
    fail: "多处转场生硬，前后画面缺乏关联，明显影响观看。",
    pass: "主要转场流畅自然，少数硬切不影响整体观感。",
    excellent: "片段衔接自然，有稳定的转场设计感。"
  },
  {
    key: "musicContent",
    layer: "完整视频评估",
    label: "音乐内容匹配质量",
    question: "画面内容、情绪、段落推进是否与歌曲主题、歌词含义和音乐结构匹配。",
    fail: "画面内容与歌曲主题或情绪明显错位，关键段落缺少对应表达。",
    pass: "多数段落能对应歌曲主题和情绪，仅个别段落表达较弱。",
    excellent: "画面主题、情绪递进和歌曲结构高度贴合，能强化歌曲表达。"
  },
  {
    key: "lyricTiming",
    layer: "完整视频评估",
    label: "歌词时段匹配",
    question: "视频中有歌词字幕时，歌词出现、断句、消失时机是否与演唱和画面对应。",
    fail: "歌词明显提前、滞后、断句错误或与画面错配，影响理解。",
    pass: "歌词时段基本准确，偶有轻微提前或滞后但不影响观看。",
    excellent: "歌词进出、断句和演唱时机高度一致，字幕与画面表达同步。",
    skipWhen: "noLyrics",
    skipText: "视频中无歌词字幕展示，此项跳过。"
  },
  {
    key: "beatSync",
    layer: "完整视频评估",
    label: "节奏卡点",
    question: "剪辑、转场、运镜和画面重点是否卡在鼓点、重拍、副歌入口或情绪变化点上。",
    fail: "节奏点长期错位，高潮段缺少画面响应，音乐与画面割裂。",
    pass: "主要段落能跟随音乐节奏变化，少数卡点不够精准。",
    excellent: "鼓点、重拍、换段和高潮入口都有明确画面响应，节奏推动感强。"
  },
  {
    key: "lipSync",
    layer: "完整视频评估",
    label: "对口型质量",
    question: "包含演唱口型镜头时，口型开合、发音节奏、表情和头部运动是否自然同步。",
    fail: "口型与演唱明显不同步，嘴型错误、漂移或表情僵硬，影响可信度。",
    pass: "口型基本跟随演唱节奏，少量错位或不自然不影响整体观看。",
    excellent: "口型、发音节奏和表情高度同步，演唱镜头自然可信。",
    skipWhen: "noLipSync",
    skipText: "非对口型视频，此项跳过。"
  },
  {
    key: "cameraLanguage",
    layer: "完整视频评估",
    label: "镜头语言",
    question: "全片镜头语言是否统一且专业，景别、角度、运动和视觉表达是否服务内容。",
    fail: "镜头语言混乱，各片段风格、运镜逻辑几乎无关联。",
    pass: "镜头语言基本统一，有明确的视觉表达方向。",
    excellent: "镜头处理流畅、专业，形成完整视觉表达。"
  },
  {
    key: "rhythm",
    layer: "完整视频评估",
    label: "运镜节奏",
    question: "自然运镜与大幅度运镜使用是否合理，是否有节制地强化高潮段。",
    fail: "全程运镜平淡无变化，或全程大幅度运镜导致眩晕、疲劳。",
    pass: "节奏基本得当，存在画面高潮部分明显变化，观感舒适。",
    excellent: "运镜把控精准，自然与大幅度运镜搭配得当，观感舒适且有冲击力。"
  },
  {
    key: "story",
    layer: "完整视频评估",
    label: "叙事结构",
    question: "整片是否有清晰起承转合，情绪或故事是否完整推进。",
    fail: "故事或情绪结构差，画面堆砌感强，没有推进。",
    pass: "基本能看出起承转合，有一定叙事性，但转折点不够鲜明。",
    excellent: "结构清晰完整，情绪或故事推进自然有层次。"
  },
  {
    key: "singingCompleteness",
    layer: "完整视频评估",
    label: "歌词演唱完整度",
    question: "选段歌词是否完整，是否存在演唱截断情况。",
    fail: "歌词存在明显截断、不完整，或一句歌词明显没唱完整。",
    pass: "可能存在不明显的尾音截断，但不影响整体效果。",
    excellent: "每一句歌词都完整演唱出来，尾词完整。"
  }
];

const storyboardStandards = [
  {
    key: "promptFit",
    layer: "分镜图质量评估",
    label: "输入响应",
    question: "分镜图是否响应用户 Prompt、形象、背景和风格要求。",
    fail: "忽略核心 Prompt 或素材要求，主体、场景、风格与输入明显不符。",
    pass: "能响应主要 Prompt 和素材要求，少量细节缺失不影响判断。",
    excellent: "完整响应 Prompt、形象、背景和风格要求，关键细节明确。"
  },
  {
    key: "lyricResonance",
    layer: "分镜图质量评估",
    label: "歌词呼应度",
    question: "分镜图是否能对应歌词关键词、情绪转折和叙事意象，避免画面与歌词表达脱节。",
    fail: "分镜图与歌词含义明显无关，关键歌词缺少画面回应，或出现与歌词冲突的视觉表达。",
    pass: "多数分镜能回应主要歌词情绪和意象，少量段落表达偏弱但不影响整体判断。",
    excellent: "分镜图能准确承接歌词关键词、情绪变化和叙事意象，画面表达强化歌词感染力。",
    skipWhen: "noLyricsText",
    skipText: "未填写歌词，此项跳过。"
  },
  {
    key: "musicMoodFit",
    layer: "分镜图质量评估",
    label: "曲风/情绪匹配度",
    question: "分镜图的色彩、构图、人物状态和场景氛围是否符合歌曲曲风与情绪方向。",
    fail: "分镜图氛围与歌曲曲风或情绪明显错位，画面调性无法支撑音乐表达。",
    pass: "整体氛围基本符合曲风与情绪方向，个别分镜的情绪或风格匹配度不足。",
    excellent: "分镜图在色彩、场景、人物状态和视觉节奏上高度贴合曲风与情绪变化。"
  },
  {
    key: "imageQuality",
    layer: "分镜图质量评估",
    label: "图像质量",
    question: "分镜图是否清晰、稳定，主体是否可辨认，是否有明显畸变或生成缺陷。",
    fail: "多张分镜主体糊化、畸变、肢体错误或画面不可用。",
    pass: "多数分镜清晰可用，少量瑕疵不影响整体判断。",
    excellent: "整组分镜清晰稳定，主体、动作和环境细节完整。"
  },
  {
    key: "characterFit",
    layer: "分镜图质量评估",
    label: "人物/形象符合度",
    question: "分镜图中的人物或核心形象是否与上传形象地址保持一致。",
    fail: "人物或核心形象与参考明显不符，出现严重身份、造型或数量错误。",
    pass: "人物或核心形象基本一致，局部细节有偏差。",
    excellent: "人物或核心形象高度一致，造型、气质和关键特征稳定。",
    skipWhen: "noCharacter",
    skipText: "未填写形象参考地址，此项跳过。"
  },
  {
    key: "backgroundStyleFit",
    layer: "分镜图质量评估",
    label: "背景/风格符合度",
    question: "分镜图是否响应上传的背景和风格参考。",
    fail: "背景或风格与参考明显冲突，无法支撑设定。",
    pass: "背景或风格基本匹配，少量细节不一致。",
    excellent: "背景和风格参考被稳定转化到整组分镜中。",
    skipWhen: "noBackgroundAndStyle",
    skipText: "未填写背景或风格参考地址，此项跳过。"
  },
  {
    key: "shotLanguage",
    layer: "分镜图质量评估",
    label: "镜头语言",
    question: "分镜图是否有足够的景别、角度、构图变化，能支撑后续视频生成。",
    fail: "分镜角度/景别高度重复，镜头表达单一，难以支撑完整 MV。",
    pass: "具备基础景别和构图变化，能支撑视频生成。",
    excellent: "景别、角度、构图和叙事节奏丰富，分镜编排清晰。"
  },
  {
    key: "storyboardCount",
    layer: "分镜图质量评估",
    label: "分镜数量",
    question: "分镜图数量是否足以覆盖歌曲段落，避免单张图覆盖过长歌词。",
    fail: "分镜数量明显不足，或多张分镜高度相似。",
    pass: "分镜数量基本可覆盖主要段落。",
    excellent: "分镜数量充足且差异明确，能支撑完整视频节奏。"
  }
];

const els = {
  tabs: document.querySelectorAll("[data-view-target]"),
  views: document.querySelectorAll("[data-view]"),
  dropzone: document.getElementById("dropzone"),
  input: document.getElementById("videoInput"),
  videoUrl: document.getElementById("videoUrl"),
  preview: document.getElementById("videoPreview"),
  stage: document.getElementById("videoStage"),
  run: document.getElementById("runReview"),
  title: document.getElementById("videoTitle"),
  artist: document.getElementById("artistName"),
  style: document.getElementById("creativeStyle"),
  lyrics: document.getElementById("lyricsText"),
  hasLipSync: document.getElementById("hasLipSync"),
  hasLyrics: document.getElementById("hasLyrics"),
  userPrompt: document.getElementById("userPrompt"),
  characterUrls: document.getElementById("characterUrls"),
  backgroundUrls: document.getElementById("backgroundUrls"),
  styleUrls: document.getElementById("styleUrls"),
  storyboardUrls: document.getElementById("storyboardUrls"),
  characterFiles: document.getElementById("characterFiles"),
  backgroundFiles: document.getElementById("backgroundFiles"),
  styleFiles: document.getElementById("styleFiles"),
  storyboardFiles: document.getElementById("storyboardFiles"),
  factName: document.getElementById("factName"),
  factDuration: document.getElementById("factDuration"),
  factSize: document.getElementById("factSize"),
  factStatus: document.getElementById("factStatus"),
  subtitle: document.getElementById("reportSubtitle"),
  overall: document.getElementById("overallScore"),
  overallLevel: document.getElementById("overallLevel"),
  videoOverallLevel: document.getElementById("videoOverallLevel"),
  storyboardOverallLevel: document.getElementById("storyboardOverallLevel"),
  metricList: document.getElementById("metricList"),
  storyboardMetricList: document.getElementById("storyboardMetricList"),
  strengthList: document.getElementById("strengthList"),
  riskList: document.getElementById("riskList"),
  recommendList: document.getElementById("recommendList"),
  timelineList: document.getElementById("timelineList"),
  standardsList: document.getElementById("standardsList"),
  standardHitList: document.getElementById("standardHitList")
};

renderStandards();
wireEvents();
updateRunState();

function wireEvents() {
  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.viewTarget));
  });

  els.input.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) loadVideo(file);
  });

  els.videoUrl.addEventListener("input", () => {
    syncVideoUrl();
    updateRunState();
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    els.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropzone.classList.add("is-dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    els.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropzone.classList.remove("is-dragover");
    });
  });

  els.dropzone.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files?.[0];
    if (file) loadVideo(file);
  });

  els.preview.addEventListener("loadedmetadata", () => {
    state.duration = Number.isFinite(els.preview.duration) ? els.preview.duration : 0;
    els.factDuration.textContent = formatDuration(state.duration);
    if (state.videoUrl) els.factStatus.textContent = "待评估";
  });

  els.preview.addEventListener("error", () => {
    if (state.videoUrl) {
      els.factStatus.textContent = "链接无法播放";
    }
  });

  document.querySelectorAll("[data-preview-target]").forEach((input) => {
    input.addEventListener("input", () => {
      renderImagePreview(input.dataset.previewTarget);
      updateRunState();
    });
  });

  document.querySelectorAll("[data-file-preview-target]").forEach((input) => {
    input.addEventListener("change", () => {
      updateAssetFiles(input);
      renderImagePreview(input.dataset.filePreviewTarget);
      updateRunState();
    });
  });

  [els.userPrompt, els.title, els.artist, els.style, els.lyrics, els.hasLipSync, els.hasLyrics].forEach((control) => {
    control.addEventListener("input", updateRunState);
    control.addEventListener("change", updateRunState);
  });

  els.run.addEventListener("click", () => {
    if (!canRunReview()) return;
    els.run.disabled = true;
    els.run.textContent = "AI 分析中...";
    els.factStatus.textContent = "分析中";

    window.setTimeout(() => {
      state.report = buildReport();
      renderReport(state.report);
      els.factStatus.textContent = "已完成";
      els.run.disabled = false;
      els.run.innerHTML = '<span class="play-symbol" aria-hidden="true"></span>重新评分';
      switchView("report");
    }, 700);
  });
}

function switchView(name) {
  els.tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.viewTarget === name);
  });
  els.views.forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === name);
  });
}

function loadVideo(file) {
  const isMp4 = file.type === "video/mp4" || file.name.toLowerCase().endsWith(".mp4");
  if (!isMp4) {
    els.factStatus.textContent = "仅支持 MP4";
    return;
  }

  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  state.file = file;
  state.videoUrl = "";
  state.objectUrl = URL.createObjectURL(file);
  state.report = null;
  els.videoUrl.value = "";

  els.preview.src = state.objectUrl;
  els.stage.classList.add("has-video");
  els.factName.textContent = file.name;
  els.factSize.textContent = formatBytes(file.size);
  els.factDuration.textContent = "--";
  els.factStatus.textContent = "待评估";
  updateRunState();
}

function syncVideoUrl() {
  const url = parseFirstUrl(els.videoUrl.value);
  if (url) {
    if (url !== state.videoUrl) loadVideoUrl(url);
    return;
  }
  if (state.videoUrl && !state.file) clearVideoSource();
}

function loadVideoUrl(url) {
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  state.file = null;
  state.videoUrl = url;
  state.objectUrl = "";
  state.duration = 0;
  state.report = null;

  els.preview.src = url;
  els.preview.load();
  els.stage.classList.add("has-video");
  els.factName.textContent = shortUrl(url);
  els.factSize.textContent = "在线链接";
  els.factDuration.textContent = "--";
  els.factStatus.textContent = "已识别链接";
  updateRunState();
}

function clearVideoSource() {
  state.videoUrl = "";
  state.duration = 0;
  state.report = null;
  els.preview.removeAttribute("src");
  els.preview.load();
  els.stage.classList.remove("has-video");
  els.factName.textContent = "未上传";
  els.factSize.textContent = "--";
  els.factDuration.textContent = "--";
  els.factStatus.textContent = "待评估";
  updateRunState();
}

function canRunReview() {
  return Boolean(hasVideoSource() || parseUrls(els.storyboardUrls.value).length || state.assetObjectUrls.storyboard.length);
}

function updateRunState() {
  els.run.disabled = !canRunReview();
}

function buildReport() {
  const inputs = getInputs();
  const seed = hash(JSON.stringify({
    file: state.file ? [state.file.name, state.file.size, Math.round(state.duration)] : [],
    videoUrl: state.videoUrl ? [state.videoUrl, Math.round(state.duration)] : [],
    prompt: inputs.prompt,
    lyrics: inputs.lyrics,
    storyboard: inputs.storyboardAssets,
    style: els.style.value
  }));

  const videoEvaluations = hasVideoSource() ? evaluateVideo(seed, inputs) : markAllSkipped(completeVideoStandards, "未上传或填写视频链接，此组不参与评估。");
  const storyboardEvaluations = inputs.storyboardAssets.length ? evaluateStoryboard(seed, inputs) : markAllSkipped(storyboardStandards, "未填写或上传分镜图，此组不参与评估。");
  const videoOverall = aggregateLevel(videoEvaluations);
  const storyboardOverall = aggregateLevel(storyboardEvaluations);
  const finalOverall = "独立评估";

  const title = els.title.value.trim() || sourceName().replace(/\.mp4$/i, "") || "未命名 MV";
  const artist = els.artist.value.trim() || "未填写艺人";

  return {
    title,
    artist,
    fileName: sourceName() || "未上传",
    duration: state.duration,
    inputs,
    finalOverall,
    videoOverall,
    storyboardOverall,
    videoEvaluations,
    storyboardEvaluations,
    strengths: pickStrengths(videoEvaluations, storyboardEvaluations),
    risks: pickRisks(videoEvaluations, storyboardEvaluations),
    recommendations: pickRecommendations(videoEvaluations, storyboardEvaluations),
    timeline: buildTimeline(state.duration, videoEvaluations, storyboardEvaluations)
  };
}

function evaluateVideo(seed, inputs) {
  const skipState = {
    noLipSync: !els.hasLipSync.checked,
    noLyrics: !els.hasLyrics.checked
  };
  return completeVideoStandards.map((standard, index) => {
    if (standard.skipWhen && skipState[standard.skipWhen]) {
      return evaluationFromStandard(standard, "N/A", standard.skipText, null);
    }
    const rawScore = videoScoreFor(standard.key, seed, index, inputs);
    const level = levelFromScore(rawScore);
    return evaluationFromStandard(standard, level, copyForLevel(standard, level), rawScore);
  });
}

function evaluateStoryboard(seed, inputs) {
  const skipState = {
    noCharacter: inputs.characterAssets.length === 0,
    noBackgroundAndStyle: inputs.backgroundAssets.length === 0 && inputs.styleAssets.length === 0,
    noLyricsText: inputs.lyrics.length === 0
  };
  return storyboardStandards.map((standard, index) => {
    if (standard.skipWhen && skipState[standard.skipWhen]) {
      return evaluationFromStandard(standard, "N/A", standard.skipText, null);
    }
    const rawScore = storyboardScoreFor(standard.key, seed, index, inputs);
    const level = levelFromScore(rawScore);
    return evaluationFromStandard(standard, level, copyForLevel(standard, level), rawScore);
  });
}

function videoScoreFor(key, seed, index, inputs) {
  const durationFit = scoreDuration(state.duration);
  const promptBonus = inputs.prompt.length >= 20 ? 5 : inputs.prompt.length ? 2 : -2;
  const referenceBonus = Math.min(5, inputs.characterAssets.length + inputs.backgroundAssets.length + inputs.styleAssets.length);
  const variation = ((seed >> (index * 2)) % 17) - 8;
  const styleMap = {
    narrative: { story: 7, musicContent: 4, continuity: 3 },
    atmosphere: { cameraLanguage: 5, rhythm: 4, beatSync: 3 },
    performance: { lipSync: 6, singingCompleteness: 5, beatSync: 5, lyricTiming: 4 },
    concept: { cameraLanguage: 6, continuity: 4, clarity: 3 }
  };
  const styleBonus = styleMap[els.style.value]?.[key] || 0;
  return clampHiddenScore(66 + durationFit + promptBonus + referenceBonus + styleBonus + variation);
}

function storyboardScoreFor(key, seed, index, inputs) {
  const storyboardCount = inputs.storyboardAssets.length;
  const promptBonus = inputs.prompt.length >= 20 ? 8 : inputs.prompt.length ? 4 : -6;
  const lyricsBonus = inputs.lyrics.length >= 80 ? 7 : inputs.lyrics.length ? 4 : -5;
  const referenceBonus = Math.min(8, inputs.characterAssets.length * 2 + inputs.backgroundAssets.length + inputs.styleAssets.length);
  const countBonus = storyboardCount >= 6 ? 9 : storyboardCount >= 3 ? 4 : -8;
  const moodReferenceBonus = Math.min(6, inputs.styleAssets.length * 2 + inputs.backgroundAssets.length + (inputs.prompt.length ? 2 : 0));
  const variation = ((seed >> (index * 3)) % 15) - 7;
  const keyBonus = {
    promptFit: promptBonus + referenceBonus,
    lyricResonance: lyricsBonus + countBonus,
    musicMoodFit: moodReferenceBonus + promptBonus,
    imageQuality: storyboardCount >= 1 ? 4 : -8,
    characterFit: inputs.characterAssets.length ? 5 : 0,
    backgroundStyleFit: inputs.backgroundAssets.length + inputs.styleAssets.length >= 2 ? 6 : 2,
    shotLanguage: countBonus,
    storyboardCount: countBonus + (storyboardCount >= 8 ? 4 : 0)
  }[key] || 0;
  return clampHiddenScore(61 + keyBonus + variation);
}

function evaluationFromStandard(standard, level, copy, score) {
  return {
    key: standard.key,
    layer: standard.layer,
    label: standard.label,
    question: standard.question,
    level,
    copy,
    score
  };
}

function markAllSkipped(standards, reason) {
  return standards.map((standard) => evaluationFromStandard(standard, "N/A", reason, null));
}

function copyForLevel(standard, level) {
  if (level === "优秀 ★") return standard.excellent;
  if (level === "通过 ✓") return standard.pass;
  if (level === "不通过 X") return standard.fail;
  return standard.skipText || "此项跳过。";
}

function aggregateLevel(evaluations) {
  const active = evaluations.filter((item) => item.level && item.level !== "N/A");
  if (!active.length) return "N/A";
  if (active.some((item) => item.level === "不通过 X")) return "不通过 X";
  const excellentCount = active.filter((item) => item.level === "优秀 ★").length;
  if (excellentCount >= Math.ceil(active.length / 2)) return "优秀 ★";
  return "通过 ✓";
}

function renderReport(report) {
  els.subtitle.textContent = `${report.artist} - ${report.title}，文件 ${report.fileName}，时长 ${formatDuration(report.duration)}。分镜图和视频按各自维度独立判定。`;
  els.overall.textContent = "分别";
  els.overallLevel.textContent = report.finalOverall;
  els.videoOverallLevel.textContent = report.videoOverall;
  els.storyboardOverallLevel.textContent = report.storyboardOverall;
  document.querySelector(".score-dial").style.borderColor = levelColor(report.finalOverall);

  els.metricList.innerHTML = renderMetricRows(report.videoEvaluations);
  els.storyboardMetricList.innerHTML = renderMetricRows(report.storyboardEvaluations);
  renderList(els.strengthList, report.strengths);
  renderList(els.riskList, report.risks);
  els.recommendList.innerHTML = report.recommendations.map((item) => `<li>${item}</li>`).join("");
  els.standardHitList.innerHTML = [...report.videoEvaluations, ...report.storyboardEvaluations]
    .map(
      (hit) => `
        <article class="standard-hit ${hit.level === "N/A" ? "is-skipped" : ""}">
          <strong>${hit.layer} · ${hit.label}</strong>
          <span>${hit.level}</span>
          <p>${hit.copy}</p>
        </article>
      `
    )
    .join("");
  els.timelineList.innerHTML = report.timeline
    .map(
      (item) => `
        <div class="timeline-item">
          <div class="timeline-time">${item.time}</div>
          <div class="timeline-copy">${item.copy}</div>
        </div>
      `
    )
    .join("");
}

function renderMetricRows(evaluations) {
  return evaluations
    .map(
      (item) => `
        <div class="metric-row level-row ${item.level === "N/A" ? "is-skipped" : ""}">
          <strong>${item.label}</strong>
          <div class="metric-copy">
            <p>${item.question}</p>
            <p class="metric-reason"><span>原因</span>${item.copy}</p>
          </div>
          <em class="level-pill">${item.level}</em>
        </div>
      `
    )
    .join("");
}

function renderStandards() {
  const storyboardCards = storyboardStandards.map(renderStandardCard).join("");
  const videoCards = completeVideoStandards.map(renderStandardCard).join("");
  els.standardsList.innerHTML = storyboardCards + videoCards;
}

function renderStandardCard(standard) {
  return `
    <article class="standard-card">
      <p class="eyebrow">${standard.layer}${standard.skipText ? " / 可跳过" : ""}</p>
      <h3>${standard.label}</h3>
      <p>${standard.question}</p>
      ${standard.skipText ? `<p class="skip-note">${standard.skipText}</p>` : ""}
      <dl class="rubric">
        <div><dt>不通过 X</dt><dd>${standard.fail}</dd></div>
        <div><dt>通过 ✓</dt><dd>${standard.pass}</dd></div>
        <div><dt>优秀 ★</dt><dd>${standard.excellent}</dd></div>
      </dl>
    </article>
  `;
}

function renderImagePreview(targetId) {
  const target = document.getElementById(targetId);
  const urls = urlsForPreview(targetId);
  target.innerHTML = urls.length
    ? urls.map((url) => `<img src="${escapeAttribute(url)}" alt="素材预览" loading="lazy" />`).join("")
    : `<span>暂无图片</span>`;
}

function getInputs() {
  const characterUrls = parseUrls(els.characterUrls.value);
  const backgroundUrls = parseUrls(els.backgroundUrls.value);
  const styleUrls = parseUrls(els.styleUrls.value);
  const storyboardUrls = parseUrls(els.storyboardUrls.value);
  return {
    prompt: els.userPrompt.value.trim(),
    lyrics: els.lyrics.value.trim(),
    characterUrls,
    backgroundUrls,
    styleUrls,
    storyboardUrls,
    characterFiles: [...state.assetObjectUrls.character],
    backgroundFiles: [...state.assetObjectUrls.background],
    styleFiles: [...state.assetObjectUrls.style],
    storyboardFiles: [...state.assetObjectUrls.storyboard],
    characterAssets: [...characterUrls, ...state.assetObjectUrls.character],
    backgroundAssets: [...backgroundUrls, ...state.assetObjectUrls.background],
    styleAssets: [...styleUrls, ...state.assetObjectUrls.style],
    storyboardAssets: [...storyboardUrls, ...state.assetObjectUrls.storyboard]
  };
}

function updateAssetFiles(input) {
  const key = assetKeyFromInput(input.id);
  state.assetObjectUrls[key].forEach((url) => URL.revokeObjectURL(url));
  state.assetObjectUrls[key] = Array.from(input.files || [])
    .filter((file) => file.type.startsWith("image/"))
    .map((file) => URL.createObjectURL(file));
}

function assetKeyFromInput(id) {
  return {
    characterFiles: "character",
    backgroundFiles: "background",
    styleFiles: "style",
    storyboardFiles: "storyboard"
  }[id];
}

function urlsForPreview(targetId) {
  const map = {
    characterPreview: [els.characterUrls.value, state.assetObjectUrls.character],
    backgroundPreview: [els.backgroundUrls.value, state.assetObjectUrls.background],
    stylePreview: [els.styleUrls.value, state.assetObjectUrls.style],
    storyboardPreview: [els.storyboardUrls.value, state.assetObjectUrls.storyboard]
  };
  const [urlText, fileUrls] = map[targetId];
  return [...parseUrls(urlText), ...fileUrls];
}

function parseUrls(value) {
  return value
    .split(/\n|,|\s+/)
    .map((item) => item.trim())
    .filter((item) => /^https?:\/\/.+/i.test(item));
}

function parseFirstUrl(value) {
  return parseUrls(value)[0] || "";
}

function hasVideoSource() {
  return Boolean(state.file || state.videoUrl);
}

function sourceName() {
  if (state.file) return state.file.name;
  if (state.videoUrl) return shortUrl(state.videoUrl);
  return "";
}

function shortUrl(url) {
  try {
    const parsed = new URL(url);
    const fileName = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() || "");
    return fileName || parsed.hostname;
  } catch {
    return url;
  }
}

function pickStrengths(videoEvaluations, storyboardEvaluations) {
  const all = [...videoEvaluations, ...storyboardEvaluations].filter((item) => item.level === "优秀 ★");
  if (!all.length) return ["暂无优秀档维度，建议优先修正不通过项后再提升整体表现。"];
  return all.slice(0, 4).map((item) => `${item.layer}的「${item.label}」达到优秀档。`);
}

function pickRisks(videoEvaluations, storyboardEvaluations) {
  const failed = [...videoEvaluations, ...storyboardEvaluations].filter((item) => item.level === "不通过 X");
  if (!failed.length) return ["暂无不通过维度；若优秀维度不足半数，整体仍按通过处理。"];
  return failed.slice(0, 5).map((item) => `${item.layer}的「${item.label}」不通过：${item.copy}`);
}

function pickRecommendations(videoEvaluations, storyboardEvaluations) {
  const failed = [...storyboardEvaluations, ...videoEvaluations].filter((item) => item.level === "不通过 X");
  if (failed.length) {
    return failed.slice(0, 5).map((item) => `优先处理「${item.label}」：${item.copy}`);
  }
  const passed = [...storyboardEvaluations, ...videoEvaluations].filter((item) => item.level === "通过 ✓");
  return passed.length
    ? passed.slice(0, 5).map((item) => `把「${item.label}」从通过提升到优秀：${item.question}`)
    : ["当前主要维度达到优秀，可进入交付物料检查：封面帧、切条、字幕安全区和移动端裁切。"];
}

function buildTimeline(duration, videoEvaluations, storyboardEvaluations) {
  const videoOverall = aggregateLevel(videoEvaluations);
  const storyboardOverall = aggregateLevel(storyboardEvaluations);
  return [
    { time: "分镜", copy: storyboardOverall === "N/A" ? "未提供分镜图，跳过分镜图评估。" : `分镜图整体为${storyboardOverall}。` },
    { time: "成片", copy: videoOverall === "N/A" ? "未上传或填写视频链接，跳过完整视频评估。" : `完整视频整体为${videoOverall}。` },
    { time: formatDuration(duration || 0), copy: "任一维度不通过时，对应整组分镜图或整条视频直接判为不通过。" },
    { time: "规则", copy: "若无不通过项，且优秀维度达到或超过半数，则对应结果判为优秀；否则为通过。" }
  ];
}

function renderList(target, items) {
  target.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function levelFromScore(score) {
  if (score > 80) return "优秀 ★";
  if (score > 60) return "通过 ✓";
  return "不通过 X";
}

function shortLevel(level) {
  if (level === "优秀 ★") return "优秀";
  if (level === "通过 ✓") return "通过";
  if (level === "不通过 X") return "不通过";
  return "--";
}

function levelColor(level) {
  if (level === "优秀 ★") return "#2f8b57";
  if (level === "通过 ✓") return "#c78318";
  if (level === "不通过 X") return "#d45d4c";
  return "#aab6c2";
}

function scoreDuration(seconds) {
  if (!seconds) return 0;
  if (seconds >= 60 && seconds <= 180) return 5;
  if (seconds >= 30 && seconds <= 240) return 2;
  return -5;
}

function clampHiddenScore(value) {
  return Math.max(35, Math.min(96, Math.round(value)));
}

function hash(input) {
  let value = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    value ^= input.charCodeAt(i);
    value += (value << 1) + (value << 4) + (value << 7) + (value << 8) + (value << 24);
  }
  return value >>> 0;
}

function formatDuration(seconds) {
  if (!seconds) return "--";
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const rest = String(total % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

function formatBytes(bytes) {
  if (!bytes) return "--";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function escapeAttribute(value) {
  return value.replace(/"/g, "&quot;");
}
