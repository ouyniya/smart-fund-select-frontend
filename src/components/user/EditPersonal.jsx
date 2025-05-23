import { useState } from "react";
import { useNavigate } from "react-router";
import { Pencil, Mail, UserPen, User2 } from "lucide-react";
import useUserStore from "../../stores/useUserStore";
import { createAlert } from "../../utils/createAlert";
import Swal from "sweetalert2";

function EditPersonal() {
  const navigate = useNavigate(); // สร้างตัวแปร navigate

  const currentUser = useUserStore((state) => state.currentUser);
  const token = useUserStore((state) => state.token);
  const updateUser = useUserStore((state) => state.updateUser);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const getCurrentUser = useUserStore((state) => state.getCurrentUser);

  const { user } = currentUser || {};
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(user?.profileImage);

  const hdlUpdateProfile = async (e) => {
    try {
      e.preventDefault();
      let body = new FormData();
      if (email) body.append("email", email);
      if (username) body.append("username", username);
      if (file) body.append("profile", file);
      // console.log(email, username, file);

      console.log(body);

      // validate >> if no change
      if (email === user?.email && username === user?.username && !file) {
        createAlert("info", "ไม่มีการเปลี่ยนแปลง");
      } else {
        // update into db
        await updateUser(token, body);
        await getCurrentUser(token);
        createAlert("success", "บันทึกข้อมูลเรียบร้อยแล้ว");
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      // console.log(error);
      createAlert("info", errMsg);
    }
  };

  const hdlDeleteProfile = async () => {
    try {
      Swal.fire({
        title: "ยืนยันลบผู้ใช้งานใช่ไหม?",
        text: "เมื่อลบแล้วจะไม่สามารถนำกลับมาได้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ลบเลย!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteUser(token);
          navigate("/");
          Swal.fire({
            title: "ลบเรียบร้อยแล้ว!",
            text: "ลบผู้ใช้งานเรียบร้อยแล้ว",
            icon: "success",
          });
        }
      });
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      // console.log(error);
      createAlert("info", errMsg);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFilePreview(URL.createObjectURL(file)); // สร้าง URL พรีวิว
    }
  };

  return (
    <>
      <div>
        <div className="lg:flex w-full gap-5">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange} // เวลาเพิ่มรูปจะแสดงตัวอย่างทันทีเลย
            className="hidden"
            id="fileInput"
          />
          {/*  edit avatar */}
          <div className="relative flex basis-1/4 justify-center items-start">
            <div className="avatar">
              {/* htmlFor="fileInput" >> label ของ input ข้างบน */}
              <label htmlFor="fileInput" className="cursor-pointer">
                <div className="absolute z-10 bottom-1 right-2 rounded-full bg-secondary px-[8px] py-[2px] flex justify-center items-center hover:ring-2">
                  <div className="tooltip" data-tip="แก้ไขรูป Profile">
                    <Pencil className="w-[12px] stroke-white" />
                  </div>
                </div>
              </label>
              <div className="w-[150px] rounded-full">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User2 className="mt-[32px] ml-[12px] w-full h-[100px] text-gray-500" />
                )}
              </div>
            </div>
          </div>
          {/*  edit profile */}
          <form className="w-full m-auto" onSubmit={hdlUpdateProfile}>
            <div className="flex flex-col justify-center w-full m-auto mt-[48px]">
              <div className="flex flex-col gap-5">
                <div className="lg:flex justify-around m-auto gap-5 w-full">
                  <div className="input input-bordered flex items-center basis-1/2 mb-[18px] lg:mb-[0px]">
                    <Mail />
                    <input
                      type="text"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className="grow ml-3"
                      placeholder={user?.email}
                    />
                  </div>
                  <div className="input input-bordered flex items-center basis-1/2 ">
                    <UserPen />
                    <input
                      type="text"
                      name="username"
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      className="grow ml-3"
                      placeholder={user?.username}
                    />
                  </div>
                </div>
              </div>

              {/* save button */}
              <div className="flex justify-end mt-[24px]">
                <button className="btn text-white bg-[var(--blue)] hover:btn-secondary">
                  บันทึก
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="relative">
          <button
            onClick={hdlDeleteProfile}
            className="absolute -top-[30px] lg:left-[210px] link link-secondary"
          >
            ลบบัญชี
          </button>
        </div>
      </div>
    </>
  );
}

export default EditPersonal;
