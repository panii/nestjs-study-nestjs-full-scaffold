import { json, redirect, LoaderFunction, ActionFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";

export const loader: LoaderFunction = async ({ params }) => {
  if (params.token === "abc") {
    return json({ token: params.token, hasData: true, l: "再次", turnover_predict_result: "33", score: "super", level: "lv3" });
  } else {
    return json({ token: params.token, hasData: false, l: "", turnover_predict_result: "?", score: "?", level: "?" });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const token = form.get("token");
  const errors: any = {};

  if (token === 'abc') {
    errors["message"] = "wo kao";
  } else {
    console.log(errors['x']['hggh'])
  }
  if (Object.keys(errors).length) {
    return json(errors, { status: 500 });
  }

  // await createUser(form);
  return redirect("/frontend-for-model/" + "abc");
};

export default function tokenIndex() {
  const page = useLoaderData();
  const errors = useActionData();

  const transition = useTransition();
  const isCreating = Boolean(transition.submission);

  return (
    <>
      {errors?.message ? (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.message}</span>
          </div>
        </div>
      ) : null}
      <div className="grid md:flex gap-5">
        <div className="flex-none">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">逾期预测模型</h2>

              <div className="stats shadow">
                <div className="stat place-items-center">
                  <div className="stat-title">分数</div>
                  <div className="stat-value">{page.hasData ? page.score : page.score}</div>
                  {/* <div className="stat-desc">From January 1st to February 1st</div> */}
                </div>

                <div className="stat place-items-center">
                  <div className="stat-title">等级</div>
                  <div className="stat-value">{page.hasData ? page.level : page.level}</div>
                  {/* <div className="stat-desc text-secondary">↗︎ 40 (2%)</div> */}
                </div>
              </div>
              <Form method="post">
                <input type="hidden" value={page.token} name="token" />
                <div className="card-actions justify-end mt-3">
                  <button className="btn btn-primary btn-outline" disabled={isCreating}>
                    {isCreating ? "计算中..." : page.l + "计算"}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
        <div className="grow">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">营业额预测模型</h2>

              <div className="stats shadow">
                <div className="stat place-items-center">
                  <div className="stat-title">分数</div>
                  <div className="stat-value">{page.hasData ? page.turnover_predict_result : page.turnover_predict_result}</div>
                  {/* <div className="stat-desc">From January 1st to February 1st</div> */}
                </div>
              </div>

              <Form method="post">
                <input type="hidden" value={page.token} name="token" />
                <div className="card-actions justify-end mt-3">
                  <button className="btn btn-primary btn-outline" disabled={isCreating}>
                    {isCreating ? "计算中..." : page.l + "计算"}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
