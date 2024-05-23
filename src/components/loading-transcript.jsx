export function LoadingTranscript() {
  return (
    <div>
      <div className="bg-neutral-100 rounded-2xl px-4 py-2 rounded-bl-none gap-2 justify-between items-start group inline-block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          className="w-8 h-8"
        >
          <circle
            fill="#3B82F6"
            stroke="#3B82F6"
            stroke-width="15"
            r="15"
            cx="40"
            cy="100"
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur="2"
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="-.4"
            ></animate>
          </circle>
          <circle
            fill="#3B82F6"
            stroke="#3B82F6"
            stroke-width="15"
            r="15"
            cx="100"
            cy="100"
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur="2"
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="-.2"
            ></animate>
          </circle>
          <circle
            fill="#3B82F6"
            stroke="#3B82F6"
            stroke-width="15"
            r="15"
            cx="160"
            cy="100"
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur="2"
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="0"
            ></animate>
          </circle>
        </svg>
      </div>
      <p className="text-sm text-neutral-500">
        Meeting Assistant is transcribing the meeting...
      </p>
    </div>
  );
}
